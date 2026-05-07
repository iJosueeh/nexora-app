import { TestBed } from '@angular/core/testing';
import { Apollo } from 'apollo-angular';
import { of, throwError } from 'rxjs';
import { NotificationService } from './notification.service';
import { SupabaseAuthService } from './supabase-auth.service';
import { AuthSession } from './auth-session';
import { NOTIFICATION_HISTORY_QUERY } from '../../graphql/graphql.queries';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('NotificationService', () => {
  let service: NotificationService;
  let apolloSpy: any;
  let supabaseSpy: any;
  let authSessionSpy: any;

  beforeEach(() => {
    apolloSpy = {
      query: vi.fn(),
      mutate: vi.fn()
    };

    supabaseSpy = {
      getClient: vi.fn(() => ({
        channel: vi.fn(() => ({
          on: vi.fn().mockReturnThis(),
          subscribe: vi.fn()
        }))
      }))
    };

    authSessionSpy = {
      user: vi.fn(() => ({ id: '123' }))
    };

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: Apollo, useValue: apolloSpy },
        { provide: SupabaseAuthService, useValue: supabaseSpy },
        { provide: AuthSession, useValue: authSessionSpy }
      ]
    });

    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load initial data on user session', () => {
    const mockNotifications = [{ id: '1', type: 'LIKE', isRead: false }];
    apolloSpy.query.mockReturnValue(of({ data: { notificationHistory: mockNotifications } }));

    service.fetchHistory(10, 0);

    expect(apolloSpy.query).toHaveBeenCalledWith(expect.objectContaining({
      query: NOTIFICATION_HISTORY_QUERY
    }));
    expect(service.notifications()).toEqual(mockNotifications);
  });

  it('should update unread count', () => {
    apolloSpy.query.mockReturnValue(of({ data: { unreadNotificationsCount: 5 } }));

    service.fetchUnreadCount();

    expect(service.unreadCount()).toBe(5);
  });

  it('should mark as read and update signals', () => {
    apolloSpy.mutate.mockReturnValue(of({ data: { markNotificationAsRead: true } }));
    
    // Set initial state
    (service as any).notificationsSignal.set([{ id: '1', isRead: false }]);
    (service as any).unreadCountSignal.set(1);

    service.markAsRead('1');

    expect(service.notifications()[0].isRead).toBe(true);
    expect(service.unreadCount()).toBe(0);
  });
});
