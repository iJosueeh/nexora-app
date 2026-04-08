import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RuntimeConfigService } from '../../../core/config/runtime-config.service';
import {
  LoginRequest,
  LoginResponse,
  MicrosoftCallbackRequest,
  MicrosoftCallbackResponse,
  RegisterRequest,
  RegisterResponse,
} from '../../../interfaces/auth';
import { ApiClientService } from '../../../shared/services/api-client.service';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  constructor(
    private readonly apiClient: ApiClientService,
    private readonly runtimeConfig: RuntimeConfigService
  ) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.apiClient.post<LoginResponse>('/auth/login', payload);
  }

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.apiClient.post<RegisterResponse>('/auth/register', payload);
  }

  getMicrosoftAuthStartUrl(redirectUri: string): string {
    const configuredUrl = this.runtimeConfig.value.microsoftAuthStartUrl;
    const startUrl = new URL(this.toAbsoluteUrl(configuredUrl), window.location.origin);
    startUrl.searchParams.set('redirect_uri', redirectUri);

    return startUrl.toString();
  }

  completeMicrosoftLogin(
    payload: MicrosoftCallbackRequest
  ): Observable<MicrosoftCallbackResponse> {
    const callbackPath = this.runtimeConfig.value.microsoftAuthCallbackPath;
    return this.apiClient.post<MicrosoftCallbackResponse>(callbackPath, payload);
  }

  isAllowedMicrosoftDomain(email: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    const allowedDomain = this.runtimeConfig.value.microsoftAllowedDomain.trim().toLowerCase();
    if (!normalizedEmail || !allowedDomain) return false;

    return normalizedEmail.endsWith(`@${allowedDomain}`);
  }

  private toAbsoluteUrl(pathOrUrl: string): string {
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
    if (pathOrUrl.startsWith('/')) return pathOrUrl;

    return `/${pathOrUrl}`;
  }
}
