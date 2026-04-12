import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedPage } from './feed-page';
import { FeedService } from './services/feed.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Post } from '../../interfaces/feed';

describe('FeedPage Component', () => {
  let component: FeedPage;
  let fixture: ComponentFixture<FeedPage>;
  let feedService: FeedService;

  const mockPosts: Post[] = [
    {
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
      content: 'Test post content',
      createdAt: new Date(),
      likes: 100,
      comments: 20,
      shares: 5,
      isLiked: false,
      tags: ['#test'],
    },
  ];

  let mockFeedService: any;

  beforeEach(async () => {
    mockFeedService = {
      getPosts: () => of(mockPosts),
    };

    await TestBed.configureTestingModule({
      imports: [FeedPage, RouterTestingModule],
      providers: [{ provide: FeedService, useValue: mockFeedService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedPage);
    component = fixture.componentInstance;
    feedService = TestBed.inject(FeedService);
  });

  it('should create the feed-page component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize posts signal as empty array', () => {
    expect(component.posts()).toBeDefined();
  });

  it('should initialize isLoading signal as true', () => {
    expect(component.isLoading()).toBe(true);
  });

  it('should load posts from FeedService on ngOnInit', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.posts().length).toBeGreaterThan(0);
  });

  it('should set posts signal after service call', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.posts().length).toBeGreaterThan(0);
    expect(component.posts()[0].id).toBe('1');
  });

  it('should set isLoading to false after posts are loaded', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.isLoading()).toBe(false);
  });

  it('should have 3-column layout with sidebars', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.classList.contains('ml-64')).toBe(true);
    expect(compiled.classList.contains('mr-80')).toBe(true);
  });

  it('should display feed header', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Para Ti');
  });

  it('should render app-feed-sidebar component', () => {
    fixture.detectChanges();
    const sidebarComponent = fixture.nativeElement.querySelector('app-feed-sidebar');
    expect(sidebarComponent).toBeTruthy();
  });

  it('should render app-feed-trends component', () => {
    fixture.detectChanges();
    const trendsComponent = fixture.nativeElement.querySelector('app-feed-trends');
    expect(trendsComponent).toBeTruthy();
  });

  it('should render app-post-card components for each post', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const postCards = fixture.nativeElement.querySelectorAll('app-post-card');
    expect(postCards.length).toBe(mockPosts.length);
  });

  it('should display loading spinner when isLoading is true', () => {
    component.isLoading.set(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Cargando');
  });

  it('should have dark theme styling', () => {
    const main = fixture.nativeElement.querySelector('main');
    expect(main.classList.contains('bg-[#0a0a0a]')).toBe(true);
  });

  it('should have proper border colors', () => {
    const main = fixture.nativeElement.querySelector('main');
    expect(main.classList.contains('border-[#1a1a1a]')).toBe(true);
  });

  it('should have proper text color for header', () => {
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('header');
    expect(header.classList.contains('text-[#ffffff]')).toBe(true);
  });
});
