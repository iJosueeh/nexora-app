import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsPage } from './notifications-page';
import { NotificationService } from '../../../../core/services/notification.service';
import { signal, Component } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideRouter } from '@angular/router';
import { AuthSession } from '../../../../core/services/auth-session';
import { ShellLayout } from '../../../../shared/components/shell-layout/shell-layout';
import { FeedSidebar } from '../../components/feed-sidebar/feed-sidebar';

describe('NotificationsPage', () => {
  let component: NotificationsPage;
  let fixture: ComponentFixture<NotificationsPage>;
  let notificationServiceMock: any;
  let authSessionMock: any;

  beforeEach(async () => {
    notificationServiceMock = {
      unreadCount: signal(0),
      notifications: signal([]),
      fetchHistory: vi.fn(),
      markAllAsRead: vi.fn()
    };

    authSessionMock = {
      user: signal({ id: '123' }),
      getUser: () => ({ id: '123' })
    };

    await TestBed.configureTestingModule({
      imports: [NotificationsPage],
      providers: [
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: AuthSession, useValue: authSessionMock },
        provideRouter([])
      ]
    })
    .overrideComponent(NotificationsPage, {
      set: { 
        imports: [],
        providers: []
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch history on init', () => {
    expect(notificationServiceMock.fetchHistory).toHaveBeenCalled();
  });
});
