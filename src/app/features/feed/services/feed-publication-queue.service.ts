import { Injectable, signal } from '@angular/core';

import { Post } from '../../../interfaces/feed';

@Injectable({
  providedIn: 'root'
})
export class FeedPublicationQueueService {
  private readonly queuedPost = signal<Post | null>(null);

  queue(post: Post): void {
    this.queuedPost.set(post);
  }

  consume(): Post | null {
    const post = this.queuedPost();
    this.queuedPost.set(null);
    return post;
  }
}
