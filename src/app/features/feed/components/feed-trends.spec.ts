import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedTrends, Trend, SuggestedUser } from './feed-trends/feed-trends';

describe('FeedTrends Component', () => {
  let component: FeedTrends;
  let fixture: ComponentFixture<FeedTrends>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedTrends],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedTrends);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the feed-trends component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize trends signal with default data', () => {
    expect(component.trends()).toBeTruthy();
    expect(component.trends().length).toBeGreaterThan(0);
  });

  it('should initialize suggestedUsers signal with default data', () => {
    expect(component.suggestedUsers()).toBeTruthy();
    expect(component.suggestedUsers().length).toBeGreaterThan(0);
  });

  it('should display Tendencias Actuales heading', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Tendencias Actuales');
  });

  it('should have sticky positioning', () => {
    const aside = fixture.nativeElement.querySelector('aside');
    expect(aside.classList.contains('sticky')).toBe(true);
    expect(aside.classList.contains('top-0')).toBe(true);
  });

  it('should update trends when signal is set', () => {
    const newTrends: Trend[] = [
      {
        category: 'Technology',
        title: '#NewTrend',
        conversations: '50K',
      },
    ];
    component.trends.set(newTrends);
    fixture.detectChanges();
    expect(component.trends().length).toBe(1);
    expect(component.trends()[0].title).toBe('#NewTrend');
  });

  it('should have correct background color for trends sidebar', () => {
    const aside = fixture.nativeElement.querySelector('aside');
    expect(aside.classList.contains('bg-[var(--brand-black)]')).toBe(true);
  });

  it('should have border styling on trends sidebar', () => {
    const aside = fixture.nativeElement.querySelector('aside');
    expect(aside.classList.contains('border-[var(--brand-border)]')).toBe(true);
  });
});
