import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileSettingsPage } from './profile-settings';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AuthSession } from '../../../core/services/auth-session';
import { SupabaseStorageService } from '../../../core/services/supabase-storage.service';
import { ToastrService } from 'ngx-toastr';
import { AuthApiService } from '../../auth/services/auth-api.service';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';

describe('ProfileSettingsPage', () => {
  let component: ProfileSettingsPage;
  let fixture: ComponentFixture<ProfileSettingsPage>;
  let authSessionSpy: any;
  let storageServiceSpy: any;
  let toastrSpy: any;
  let authApiSpy: any;
  let apolloSpy: any;

  const mockUser = {
    id: '123',
    fullName: 'Test User',
    username: 'testuser',
    bio: 'Test Bio',
    career: 'Sistemas',
    academicInterests: ['AI']
  };

  beforeEach(async () => {
    authSessionSpy = {
      getUser: vi.fn().mockReturnValue(mockUser),
      mergeUser: vi.fn()
    };

    storageServiceSpy = {
      uploadFile: vi.fn()
    };

    toastrSpy = {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn()
    };

    authApiSpy = {
      getRegistrationCatalogs: vi.fn().mockReturnValue(of({ careers: ['Sistemas'], academicInterests: ['AI'] }))
    };

    apolloSpy = {
      mutate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ProfileSettingsPage, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: AuthSession, useValue: authSessionSpy },
        { provide: SupabaseStorageService, useValue: storageServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: AuthApiService, useValue: authApiSpy },
        { provide: Apollo, useValue: apolloSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with user data', () => {
    expect(component.form.value.fullName).toBe(mockUser.fullName);
    expect(component.form.value.username).toBe(mockUser.username);
    expect(component.form.value.career).toBe(mockUser.career);
  });

  it('should load catalogs on init', () => {
    expect(authApiSpy.getRegistrationCatalogs).toHaveBeenCalled();
    expect(component.careerOptions()).toContain('Sistemas');
    expect(component.interestOptions()).toContain('AI');
  });

  it('should toggle interests', () => {
    component.toggleInterest('UI Design');
    expect(component.form.value.academicInterests).toContain('UI Design');
    
    component.toggleInterest('AI'); // Was already there
    expect(component.form.value.academicInterests).not.toContain('AI');
  });

  it('should call apollo mutate on save', () => {
    const updatedUser = { ...mockUser, fullName: 'New Name' };
    apolloSpy.mutate.mockReturnValue(of({ data: { actualizarPerfil: updatedUser } }));

    component.form.patchValue({ fullName: 'New Name' });
    component.save();

    expect(apolloSpy.mutate).toHaveBeenCalled();
    expect(authSessionSpy.mergeUser).toHaveBeenCalledWith(updatedUser);
    expect(toastrSpy.success).toHaveBeenCalledWith('Perfil actualizado correctamente');
  });

  it('should show warning if form is invalid on save', () => {
    component.form.patchValue({ fullName: '' }); // Required
    component.save();

    expect(toastrSpy.warning).toHaveBeenCalled();
    expect(apolloSpy.mutate).not.toHaveBeenCalled();
  });
});
