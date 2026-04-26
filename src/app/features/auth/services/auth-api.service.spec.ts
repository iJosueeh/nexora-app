import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import { ApiClientService } from '../../../shared/services/api-client.service';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let apiClientSpy: any;

  beforeEach(() => {
    apiClientSpy = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AuthApiService,
        { provide: ApiClientService, useValue: apiClientSpy }
      ]
    });
    service = TestBed.inject(AuthApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call session profile and return normalized response', async () => {
    const mockRawResponse = {
      data: {
        user: { id: '1', email: 'test@utp.edu.pe', username: 'test' }
      }
    };
    apiClientSpy.get.mockReturnValue(of(mockRawResponse));

    const response = await firstValueFrom(service.getSessionProfile());

    expect(apiClientSpy.get).toHaveBeenCalledWith('/auth/session');
    expect(response.user?.id).toBe('1');
    expect(response.user?.email).toBe('test@utp.edu.pe');
  });

  it('should call catalogs and return careers and interests', async () => {
    const mockCatalogs = {
      data: {
        careers: ['Sistemas', 'Industrial'],
        academicInterests: ['IA', 'Data Science']
      }
    };
    apiClientSpy.get.mockReturnValue(of(mockCatalogs));

    const response = await firstValueFrom(service.getRegistrationCatalogs());

    expect(apiClientSpy.get).toHaveBeenCalledWith('/auth/catalogs');
    expect(response.careers).toContain('Sistemas');
    expect(response.academicInterests).toContain('IA');
  });
});
