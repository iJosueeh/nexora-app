import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedSidebar } from './feed-sidebar/feed-sidebar';
import { provideRouter } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthSession } from '../../../core/services/auth-session';
import { signal } from '@angular/core';

describe('FeedSidebar Component', () => {
  let component: FeedSidebar;
  let fixture: ComponentFixture<FeedSidebar>;
  let notificationServiceMock: any;
  let authSessionMock: any;

  beforeEach(async () => {
    notificationServiceMock = {
      unreadCount: signal(5)
    };

    authSessionMock = {
      user: signal({ id: '123', username: 'testuser' }),
      getUser: () => ({ id: '123', username: 'testuser' })
    };

    await TestBed.configureTestingModule({
      imports: [FeedSidebar],
      providers: [
        provideRouter([]),
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: AuthSession, useValue: authSessionMock }
      ]
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
    expect(compiled.textContent).toContain('NEXORA');
  });

  it('should have sidebar sticky positioning', () => {
    const aside = fixture.nativeElement.querySelector('aside');
    expect(aside.classList.contains('sticky')).toBe(true);
    expect(aside.classList.contains('top-0')).toBe(true);
  });

  it('should reflect unreadCount from NotificationService', () => {
    expect(component.unreadCount()).toBe(5);
  });

  it('should update badge when NotificationService unreadCount changes', () => {
    notificationServiceMock.unreadCount.set(3);
    fixture.detectChanges();
    expect(component.unreadCount()).toBe(3);
    const badge = fixture.nativeElement.querySelector('.bg-\\[var\\(--brand-red\\)\\]');
    expect(badge.textContent.trim()).toBe('3');
  });

  it('should render navigation menu', () => {
    const navItems = fixture.nativeElement.querySelectorAll('nav a');
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

  it('should have Postear button', () => {
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const postearButton = Array.from(buttons).find((btn: any) => 
      btn.textContent.includes('Postear')
    );
    expect(postearButton).toBeTruthy();
  });
});
