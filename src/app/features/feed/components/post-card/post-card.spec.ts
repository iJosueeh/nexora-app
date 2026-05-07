import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostCardComponent } from './post-card';
import { Post } from '../../../../interfaces/feed';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('PostCard Component', () => {
  let component: PostCardComponent;
  let fixture: ComponentFixture<PostCardComponent>;
  let apolloSpy: any;

  const mockPost: Post = {
    id: '1',
    is_official: true,
    author: {
      id: '101',
      email: 'test@example.com',
      username: 'testuser',
      fullName: 'Test User',
      role: 'Developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test',
      verified: true,
      bio: ''
    },
    content: 'This is a test post',
    imageUrl: 'https://example.com/image.jpg',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likesCount: 100,
    commentsCount: 20,
    shares: 5,
    isLiked: false,
    tags: ['test', 'angular'],
  };

  beforeEach(async () => {
    apolloSpy = {
      mutate: vi.fn().mockReturnValue(of({ data: { toggleLike: true } }))
    };

    await TestBed.configureTestingModule({
      imports: [PostCardComponent],
      providers: [
        { provide: Apollo, useValue: apolloSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('post', mockPost);
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

  it('should toggle like locally and call api', () => {
    const event = new MouseEvent('click');
    component.toggleLike(event);

    expect(component.isLiked()).toBe(true);
    expect(component.likesCount()).toBe(101);
    expect(apolloSpy.mutate).toHaveBeenCalled();
  });

  it('should compute relative date in Spanish', () => {
    expect(component.relativeDate().toLowerCase()).toContain('hace');
  });

  it('should display post tags with #', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('#test');
    expect(compiled.textContent).toContain('#angular');
  });
});
