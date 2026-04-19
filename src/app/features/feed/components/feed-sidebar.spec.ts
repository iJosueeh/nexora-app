import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedSidebar } from './feed-sidebar/feed-sidebar';
import { RouterTestingModule } from '@angular/router/testing';

describe('FeedSidebar Component', () => {
  let component: FeedSidebar;
  let fixture: ComponentFixture<FeedSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedSidebar, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the feed-sidebar component', () => {
    expect(component).toBeTruthy();
  });

  it('should display Nexora logo text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Nexora');
  });

  it('should have sidebar fixed positioning', () => {
    const aside = fixture.nativeElement.querySelector('aside');
    expect(aside.classList.contains('fixed')).toBe(true);
    expect(aside.classList.contains('w-64')).toBe(true);
    expect(aside.classList.contains('h-screen')).toBe(true);
  });

  it('should initialize notificationBadge signal with value 5', () => {
    expect(component.notificationBadge()).toBe(5);
  });

  it('should update notificationBadge when signal value changes', () => {
    component.notificationBadge.set(3);
    expect(component.notificationBadge()).toBe(3);
  });

  it('should render navigation menu with nav items', () => {
    const navItems = fixture.nativeElement.querySelectorAll('nav ul li');
    expect(navItems.length).toBeGreaterThan(0);
  });

  it('should contain Inicio, Exploración, Notificación, and Perfil menu items', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Inicio');
    expect(compiled.textContent).toContain('Exploración');
    expect(compiled.textContent).toContain('Notificación');
    expect(compiled.textContent).toContain('Perfil');
  });

  it('should display notification badge in menu', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('5');
  });

  it('should have Postear button', () => {
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const postearButton = Array.from(buttons).find((btn: any) => 
      btn.textContent.includes('Postear')
    );
    expect(postearButton).toBeTruthy();
  });

  it('should have routerLink directives for navigation', () => {
    const navLinks = fixture.nativeElement.querySelectorAll('[routerLink]');
    expect(navLinks.length).toBeGreaterThan(0);
  });

  it('should apply correct text color for sidebar background', () => {
    const aside = fixture.nativeElement.querySelector('aside');
    expect(aside.classList.contains('bg-[#0a0a0a]')).toBe(true);
  });

  it('should have border styling', () => {
    const aside = fixture.nativeElement.querySelector('aside');
    expect(aside.classList.contains('border-r')).toBe(true);
    expect(aside.classList.contains('border-[#1a1a1a]')).toBe(true);
  });

  it('should render logo icon', () => {
    const svgIcon = fixture.nativeElement.querySelector('svg');
    expect(svgIcon).toBeTruthy();
    expect(svgIcon.classList.contains('text-[#e63946]')).toBe(true);
  });
});
