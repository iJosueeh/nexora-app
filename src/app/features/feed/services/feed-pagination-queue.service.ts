import { Injectable, inject } from '@angular/core';
import { Observable, ReplaySubject, Subject, EMPTY, of } from 'rxjs';
import { catchError, concatMap, finalize, tap } from 'rxjs/operators';

import { Post } from '@app/interfaces/feed';
import { FeedService } from '@app/features/feed/services/feed.service';

interface PageRequest {
  limit: number;
  offset: number;
  key: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeedPaginationQueueService {
  private readonly feedService = inject(FeedService);
  private readonly requestQueue = new Subject<PageRequest>();
  private readonly inFlightKeys = new Set<string>();
  private readonly pendingResponses = new Map<string, ReplaySubject<Post[]>>();
  private readonly pageCache = new Map<string, Post[]>();

  constructor() {
    this.requestQueue
      .pipe(concatMap((request) => this.processRequest(request)))
      .subscribe();
  }

  enqueue(limit = 5, offset = 0): Observable<Post[]> {
    const normalizedLimit = Math.max(1, limit);
    const normalizedOffset = Math.max(0, offset);
    const key = this.buildKey(normalizedLimit, normalizedOffset);

    const cached = this.pageCache.get(key);
    if (cached) {
      return of(cached.map((post) => ({ ...post })));
    }

    let response$ = this.pendingResponses.get(key);
    if (!response$) {
      response$ = new ReplaySubject<Post[]>(1);
      this.pendingResponses.set(key, response$);
    }

    if (!this.inFlightKeys.has(key)) {
      this.inFlightKeys.add(key);
      this.requestQueue.next({ limit: normalizedLimit, offset: normalizedOffset, key });
    }

    return response$.asObservable();
  }

  private processRequest(request: PageRequest): Observable<Post[]> {
    return this.feedService.getPosts(request.limit, request.offset).pipe(
      tap((posts) => {
        const snapshot = posts.map((post) => ({
          ...post,
          author: { ...post.author },
          tags: post.tags ? [...post.tags] : undefined
        }));

        this.pageCache.set(request.key, snapshot);
        this.pendingResponses.get(request.key)?.next(snapshot.map((post) => ({
          ...post,
          author: { ...post.author },
          tags: post.tags ? [...post.tags] : undefined
        })));
        this.pendingResponses.get(request.key)?.complete();
      }),
      catchError((error) => {
        this.pendingResponses.get(request.key)?.error(error);
        return EMPTY;
      }),
      finalize(() => {
        this.inFlightKeys.delete(request.key);
        this.pendingResponses.delete(request.key);
      })
    );
  }

  private buildKey(limit: number, offset: number): string {
    return `${limit}:${offset}`;
  }
}
