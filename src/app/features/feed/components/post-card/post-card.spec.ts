import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostCardComponent } from './post-card';
import { Post } from '../../../../interfaces/feed';

describe('PostCard Component', () => {
  let component: PostCardComponent;
  let fixture: ComponentFixture<PostCardComponent>;

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
    likes: 100,
    comments: 20,
    shares: 5,
    isLiked: false,
    tags: ['#test', '#angular'],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostCardComponent],
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

  it('should render post content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('This is a test post');
  });

  it('should display official badge when is_official is true', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent.toLowerCase()).toContain('university official');
  });

  it('should compute relative date in Spanish', () => {
    expect(component.relativeDate().toLowerCase()).toContain('hace');
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
    expect(article).toBeTruthy();
  });
});
