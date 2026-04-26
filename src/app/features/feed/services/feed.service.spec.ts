import { TestBed } from '@angular/core/testing';
import { ApolloTestingModule, ApolloTestingController } from 'apollo-angular/testing';
import { FeedService } from './feed.service';
import { FEED_POSTS_QUERY } from '@app/graphql/graphql.queries';
import { lastValueFrom } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('FeedService', () => {
  let service: FeedService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [FeedService],
    });
    service = TestBed.inject(FeedService);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch posts via GraphQL', async () => {
    const mockPosts = [
      {
        id: '1',
        titulo: 'Test Post',
        contenido: 'Test Content',
        tags: ['test'],
        location: 'Test Location',
        isOfficial: false,
        createdAt: new Date().toISOString(),
        commentsCount: 0,
        imageUrl: 'http://test.com/image.jpg',
        autor: {
          id: 'u1',
          username: 'tester',
          fullName: 'Test User',
          avatarUrl: 'http://test.com/avatar.jpg'
        }
      }
    ];

    const postsPromise = lastValueFrom(service.getPosts(10, 0));

    const op = controller.expectOne(FEED_POSTS_QUERY);
    op.flush({
      data: {
        obtenerFeedPrincipal: mockPosts
      }
    });

    const posts = await postsPromise;
    expect(posts.length).toBe(1);
    expect(posts[0].title).toBe('Test Post');
    expect(posts[0].imageUrl).toBe('http://test.com/image.jpg');
  });
});
