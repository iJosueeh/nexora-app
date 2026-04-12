import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedTrends, Trend, SuggestedUser } from './feed-trends';

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

  it('should display Sugerencias para Seguir heading', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Sugerencias para Seguir');
  });

  it('should render trend items', () => {
    fixture.detectChanges();
    const trendItems = fixture.nativeElement.querySelectorAll('[class*="space-y-6"] li');
    expect(trendItems.length).toBeGreaterThan(0);
  });

  it('should have fixed right sidebar positioning', () => {
    const aside = fixture.nativeElement.querySelector('aside');
    expect(aside.classList.contains('fixed')).toBe(true);
    expect(aside.classList.contains('right-0')).toBe(true);
    expect(aside.classList.contains('w-80')).toBe(true);
    expect(aside.classList.contains('h-screen')).toBe(true);
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
    expect(component.trends().length).toBe(1);
    expect(component.trends()[0].title).toBe('#NewTrend');
  });

  it('should update suggestedUsers when signal is set', () => {
    const newUsers: SuggestedUser[] = [
      {
        id: '1',
        name: 'New User',
        role: 'Developer',
        avatar: 'https://example.com/avatar.jpg',
      },
    ];
    component.suggestedUsers.set(newUsers);
    expect(component.suggestedUsers().length).toBe(1);
    expect(component.suggestedUsers()[0].name).toBe('New User');
  });

  it('should have correct background color for trends sidebar', () => {
    const aside = fixture.nativeElement.querySelector('aside');
    expect(aside.classList.contains('bg-[#06080d]')).toBe(true);
  });

  it('should have border styling on trends sidebar', () => {
    const aside = fixture.nativeElement.querySelector('aside');
    expect(aside.classList.contains('border-l')).toBe(true);
    expect(aside.classList.contains('border-[#161b25]')).toBe(true);
  });

  it('should render follow buttons for suggested users', () => {
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should have hover state for trend items', () => {
    fixture.detectChanges();
    const trendItems = fixture.nativeElement.querySelectorAll('.group');
    expect(trendItems.length).toBeGreaterThan(0);
  });

  it('should display conversation count for each trend', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('conversaciones');
  });
});
