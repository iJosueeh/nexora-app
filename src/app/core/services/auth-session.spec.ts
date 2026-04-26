import { TestBed } from '@angular/core/testing';
import { AuthSession } from './auth-session';
import { SessionPayload } from '../../interfaces/auth';

describe('AuthSession', () => {
  let service: AuthSession;

  const mockPayload: SessionPayload = {
    user: {
      id: '1',
      email: 'test@utp.edu.pe',
      username: 'testuser',
      fullName: 'Test User'
    },
    tokens: {
      accessToken: 'access',
      refreshToken: 'refresh',
      tokenType: 'Bearer'
    }
  };

  beforeEach(() => {
    // Clear storage before each test
    localStorage.clear();
    sessionStorage.clear();
    
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthSession);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start a session and persist it', () => {
    service.start(mockPayload, false);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.getUser()?.email).toBe(mockPayload.user.email);
    expect(sessionStorage.getItem('nexora.auth.session')).toBeTruthy();
  });

  it('should merge user data correctly', () => {
    service.start(mockPayload, false);
    service.mergeUser({ fullName: 'Updated Name' });
    expect(service.getUser()?.fullName).toBe('Updated Name');
    expect(service.getUser()?.username).toBe(mockPayload.user.username);
  });

  it('should clear session correctly', () => {
    service.start(mockPayload, true);
    service.clear();
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('nexora.auth.remember')).toBeNull();
  });

  it('should identify hydrated profile correctly', () => {
    expect(service.hasHydratedProfile(mockPayload.user)).toBe(true);
    expect(service.hasHydratedProfile({ email: 'only@email.com' } as any)).toBe(false);
  });
});
