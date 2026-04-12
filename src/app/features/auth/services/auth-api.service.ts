import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  RegisterIdentityRequest,
  RegisterPreferencesRequest,
  RegisterStartRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../../../interfaces/auth';
import { ApiClientService } from '../../../shared/services/api-client.service';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  constructor(
    private readonly apiClient: ApiClientService
  ) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.apiClient.post<LoginResponse>('/auth/login', payload);
  }

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.apiClient.post<RegisterResponse>('/auth/register', payload);
  }

  startRegistration(payload: RegisterStartRequest): Observable<RegisterResponse> {
    return this.apiClient.post<RegisterResponse>('/auth/register', payload);
  }

  completeRegistrationIdentity(payload: RegisterIdentityRequest): Observable<RegisterResponse> {
    return this.apiClient.put<RegisterResponse>('/auth/register', payload);
  }

  completeRegistrationPreferences(
    payload: RegisterPreferencesRequest
  ): Observable<RegisterResponse> {
    return this.apiClient.put<RegisterResponse>('/auth/register', payload);
  }
}
