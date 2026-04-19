import { Injectable, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { FEED_POSTS_QUERY } from '../../../graphql/graphql.queries';
import { Post } from '../../../interfaces/feed';

interface FeedAuthorQueryModel {
  id: string;
  username: string;
  fullName: string;
  avatarUrl?: string | null;
}

interface FeedPostQueryModel {
  id: string;
  titulo?: string | null;
  contenido: string;
  tags?: string[] | null;
  location?: string | null;
  isOfficial: boolean;
  createdAt?: string | null;
  commentsCount: number;
  autor: FeedAuthorQueryModel;
}

interface FeedPostsQueryResponse {
  obtenerFeedPrincipal: FeedPostQueryModel[];
}

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private readonly apollo = inject(Apollo);

  getPosts(limit = 5, offset = 0): Observable<Post[]> {
    return this.apollo
      .query<FeedPostsQueryResponse>({
        query: FEED_POSTS_QUERY,
        variables: {
          limit: Math.max(1, limit),
          offset: Math.max(0, offset)
        },
        fetchPolicy: 'network-only'
      })
      .pipe(map((result) => (result.data?.obtenerFeedPrincipal ?? []).map((post) => this.mapPost(post))));
  }

  private mapPost(post: FeedPostQueryModel): Post {
    return {
      id: post.id,
      author: this.mapAuthor(post),
      is_official: post.isOfficial,
      title: post.titulo?.trim() || undefined,
      content: post.contenido,
      location: post.location?.trim() || undefined,
      createdAt: post.createdAt ? new Date(post.createdAt) : new Date(),
      likes: 0,
      comments: post.commentsCount,
      shares: 0,
      tags: post.tags && post.tags.length > 0 ? post.tags : this.extractTags(post.titulo, post.contenido),
      isLiked: false
    };
  }

  private mapAuthor(post: FeedPostQueryModel) {
    return {
      id: post.autor.id,
      email: `${post.autor.username}@nexora.app`,
      username: post.autor.username,
      fullName: post.autor.fullName,
      role: post.isOfficial ? 'Nexora oficial' : 'Comunidad Nexora',
      verified: post.isOfficial,
      avatar: post.autor.avatarUrl || this.buildAvatarUrl(post.autor.username),
      bio: ''
    };
  }

  private extractTags(title?: string | null, content?: string): string[] {
    const source = [title, content].filter(Boolean).join(' ');
    const tags = source.match(/#[\p{L}\p{N}_]+/gu) ?? [];

    return [...new Set(tags.map((tag) => tag.slice(1).toLowerCase()))].slice(0, 5);
  }

  private buildAvatarUrl(seed: string): string {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
  }
}
