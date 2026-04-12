import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostCard } from './post-card';
import { Post } from '../../../interfaces/feed';
import { signal } from '@angular/core';

describe('PostCard Component', () => {
  let component: PostCard;
  let fixture: ComponentFixture<PostCard>;

  const mockPost: Post = {
    id: '1',
    author: {
      id: '101',
      email: 'test@example.com',
      username: 'testuser',
      fullName: 'Test User',
      role: 'Developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test',
      verified: true,
    },
    content: 'This is a test post',
    imageUrl: 'https://example.com/image.jpg',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 100,
    comments: 20,
    shares: 5,
    isLiked: false,
    tags: ['#test', '#angular'],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCard],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCard);
    component = fixture.componentInstance;
    component.post = mockPost;
    fixture.detectChanges();
  });

  it('should create the post-card component', () => {
    expect(component).toBeTruthy();
  });

  it('should render author name and role', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test User');
    expect(compiled.textContent).toContain('Developer');
  });

  it('should render post content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('This is a test post');
  });

  it('should display verified badge when author is verified', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('✓');
  });

  it('should initialize isLiked signal as false', () => {
    expect(component.isLiked()).toBe(false);
  });

  it('should toggle like status when toggleLike is called', () => {
    expect(component.isLiked()).toBe(false);
    component.toggleLike();
    expect(component.isLiked()).toBe(true);
    component.toggleLike();
    expect(component.isLiked()).toBe(false);
  });

  it('should compute correct like count based on isLiked signal', () => {
    expect(component.likeCount()).toBe(mockPost.likes);
    component.toggleLike();
    expect(component.likeCount()).toBe(mockPost.likes + 1);
    component.toggleLike();
    expect(component.likeCount()).toBe(mockPost.likes);
  });

  it('should format date as relative time in Spanish', () => {
    const formattedDate = component.formatDate(new Date(Date.now() - 2 * 60 * 60 * 1000));
    expect(formattedDate).toContain('hace');
  });

  it('should display post tags', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('#test');
    expect(compiled.textContent).toContain('#angular');
  });

  it('should show like, comment, and share counts', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('100');
    expect(compiled.textContent).toContain('20');
    expect(compiled.textContent).toContain('5');
  });

  it('should render author avatar image', () => {
    const avatarImg = fixture.nativeElement.querySelector('img');
    expect(avatarImg).toBeTruthy();
    expect(avatarImg.src).toContain('dicebear');
  });

  it('should have hover state class when hovering post', () => {
    const article = fixture.nativeElement.querySelector('article');
    expect(article.classList.contains('hover:bg-[#1a1a1a]')).toBe(true);
  });
});
