import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FeedPage } from './pages/feed-page/feed-page';

describe('FeedPage Component', () => {
  let component: FeedPage;
  let fixture: ComponentFixture<FeedPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedPage, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedPage);
    component = fixture.componentInstance;
  });

  it('should create the feed-page component', () => {
    expect(component).toBeTruthy();
  });

  it('should have 3-column layout with sidebars', () => {
    fixture.detectChanges();
    const grid = fixture.nativeElement.querySelector('.grid') as HTMLElement;
    expect(grid.className).toContain('lg:grid-cols-[13.5rem_minmax(0,1fr)_17.5rem]');
  });

  it('should display feed header', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Campus Feed');
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

  it('should render app-feed-container component', () => {
    fixture.detectChanges();
    const containerComponent = fixture.nativeElement.querySelector('app-feed-container');
    expect(containerComponent).toBeTruthy();
  });

  it('should have proper border classes in main content', () => {
    fixture.detectChanges();
    const main = fixture.nativeElement.querySelector('main') as HTMLElement;
    expect(main.classList.contains('border-[var(--brand-border)]')).toBe(true);
  });
});
