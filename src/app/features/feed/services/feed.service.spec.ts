import { TestBed } from '@angular/core/testing';
import { FeedService } from './feed.service';
import { Post } from '../../../interfaces/feed';
import { lastValueFrom } from 'rxjs';

describe('FeedService', () => {
  let service: FeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeedService],
    });
    service = TestBed.inject(FeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have getPosts method', () => {
    expect(service.getPosts).toBeDefined();
  });

  it('should return Observable<Post[]> from getPosts', async () => {
    const posts = await lastValueFrom(service.getPosts());
    expect(Array.isArray(posts)).toBe(true);
  });

  it('should return posts with required properties', async () => {
    const posts = await lastValueFrom(service.getPosts());
    expect(posts.length).toBeGreaterThan(0);

    const post = posts[0];
    expect(post.id).toBeDefined();
    expect(post.author).toBeDefined();
    expect(post.content).toBeDefined();
    expect(post.createdAt).toBeDefined();
    expect(post.likes).toBeDefined();
    expect(post.comments).toBeDefined();
    expect(post.shares).toBeDefined();
  });

  it('should return posts with author information', async () => {
    const posts = await lastValueFrom(service.getPosts());
    const post = posts[0];
    expect(post.author.id).toBeDefined();
    expect(post.author.email).toBeDefined();
    expect(post.author.username).toBeDefined();
    expect(post.author.fullName).toBeDefined();
    expect(post.author.role).toBeDefined();
    expect(post.author.avatar).toBeDefined();
  });

  it('should return posts with content text', async () => {
    const posts = await lastValueFrom(service.getPosts());
    expect(posts[0].content.length).toBeGreaterThan(0);
  });

  it('should return posts with image URL', async () => {
    const posts = await lastValueFrom(service.getPosts());
    const postsWithImage = posts.filter((post) => post.imageUrl);
    expect(postsWithImage.length).toBeGreaterThan(0);
    expect(postsWithImage[0].imageUrl).toContain('http');
  });

  it('should return posts with tags', async () => {
    const posts = await lastValueFrom(service.getPosts());
    const postsWithTags = posts.filter((post) => post.tags && post.tags.length > 0);
    expect(postsWithTags.length).toBeGreaterThan(0);
  });

  it('should return posts with numeric interaction counts', async () => {
    const posts = await lastValueFrom(service.getPosts());
    const post = posts[0];
    expect(typeof post.likes).toBe('number');
    expect(typeof post.comments).toBe('number');
    expect(typeof post.shares).toBe('number');
    expect(post.likes).toBeGreaterThanOrEqual(0);
    expect(post.comments).toBeGreaterThanOrEqual(0);
    expect(post.shares).toBeGreaterThanOrEqual(0);
  });

  it('should return at least 2 mock posts', async () => {
    const posts = await lastValueFrom(service.getPosts());
    expect(posts.length).toBeGreaterThanOrEqual(2);
  });

  it('should delay response by 500ms', async () => {
    const startTime = Date.now();
    await lastValueFrom(service.getPosts());
    const endTime = Date.now();
    const duration = endTime - startTime;
    expect(duration).toBeGreaterThanOrEqual(500);
  });

  it('should provide verified author data', async () => {
    const posts = await lastValueFrom(service.getPosts());
    const verifiedAuthors = posts.filter((post) => post.author.verified);
    expect(verifiedAuthors.length).toBeGreaterThan(0);
  });

  it('should be provided at root level', () => {
    const service1 = TestBed.inject(FeedService);
    const service2 = TestBed.inject(FeedService);
    expect(service1).toBe(service2);
  });
});
