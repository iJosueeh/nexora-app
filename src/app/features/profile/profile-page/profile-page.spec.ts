import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfilePage } from './profile-page';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { AuthSession } from '../../../core/services/auth-session';
import { AuthApiService } from '../../auth/services/auth-api.service';
import { FeedService } from '../../feed/services/feed.service';
import { of } from 'rxjs';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let authSessionSpy: any;
  let authApiSpy: any;
  let feedServiceSpy: any;
  let activatedRouteMock: any;

  const mockUser = {
    id: '123',
    email: 'test@utp.edu.pe',
    fullName: 'Test User',
    username: 'testuser',
    career: 'Sistemas',
    bio: 'Test Bio'
  };

  beforeEach(async () => {
    authSessionSpy = {
      getUser: vi.fn().mockReturnValue(mockUser),
      isAuthenticated: vi.fn().mockReturnValue(true),
    };

    authApiSpy = {
      getPublicProfile: vi.fn().mockReturnValue(of({ user: mockUser })),
    };

    feedServiceSpy = {
      getPostsByUsername: vi.fn().mockReturnValue(of([])),
    };

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue('testuser')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: AuthSession, useValue: authSessionSpy },
        { provide: AuthApiService, useValue: authApiSpy },
        { provide: FeedService, useValue: feedServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load session user as own profile if handle matches', () => {
    // OnInit already ran with 'testuser' from activatedRouteMock
    expect(component.isOwnProfile()).toBe(true);
    expect(component.profile()?.handle).toBe('@testuser');
    expect(feedServiceSpy.getPostsByUsername).toHaveBeenCalledWith('testuser', 12, 0);
  });

  it('should load public profile if handle does not match session', () => {
    // Reset and re-run with different handle
    activatedRouteMock.snapshot.paramMap.get.mockReturnValue('otheruser');
    component.ngOnInit();
    
    expect(component.isPublicView()).toBe(true);
    expect(authApiSpy.getPublicProfile).toHaveBeenCalledWith('otheruser');
  });

  it('should handle profile not found', () => {
    activatedRouteMock.snapshot.paramMap.get.mockReturnValue('nonexistent');
    authApiSpy.getPublicProfile.mockReturnValue(of(null));
    
    component.ngOnInit();
    
    expect(component.isProfileNotFound()).toBe(true);
    expect(component.profile()).toBeNull();
  });
});
