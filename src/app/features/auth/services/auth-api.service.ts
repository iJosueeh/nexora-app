import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  RegisterIdentityRequest,
  RegisterCatalogsResponse,
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
    return this.apiClient
      .post<unknown>('/auth/login', payload)
      .pipe(map((response) => this.normalizeAuthResponse(response)));
  }

  register(payload: RegisterRequest): Observable<RegisterResponse> {
    return this.apiClient
      .post<unknown>('/auth/register', payload)
      .pipe(map((response) => this.normalizeAuthResponse(response)));
  }

  startRegistration(payload: RegisterStartRequest): Observable<RegisterResponse> {
    return this.apiClient
      .post<unknown>('/auth/register', payload)
      .pipe(map((response) => this.normalizeAuthResponse(response)));
  }

  completeRegistrationIdentity(payload: RegisterIdentityRequest): Observable<RegisterResponse> {
    return this.apiClient
      .put<unknown>('/auth/register', payload)
      .pipe(map((response) => this.normalizeAuthResponse(response)));
  }

  completeRegistrationPreferences(
    payload: RegisterPreferencesRequest
  ): Observable<RegisterResponse> {
    return this.apiClient
      .put<unknown>('/auth/register', payload)
      .pipe(map((response) => this.normalizeAuthResponse(response)));
  }

  getSessionProfile(): Observable<LoginResponse> {
    return this.apiClient
      .get<unknown>('/auth/session')
      .pipe(map((response) => this.normalizeAuthResponse(response)));
  }

  getRegistrationCatalogs(): Observable<RegisterCatalogsResponse> {
    return this.apiClient
      .get<unknown>('/auth/catalogs')
      .pipe(map((response) => this.normalizeCatalogsResponse(response)));
  }

  private normalizeAuthResponse(rawResponse: unknown): RegisterResponse {
    const responseRecord = this.toRecord(rawResponse);
    const payload = this.resolvePayload(responseRecord);

    const email = this.getString(payload, 'email');
    const user = this.resolveUser(payload, email);
    const tokens = this.resolveTokens(payload);

    return {
      email,
      user,
      tokens,
    };
  }

  private resolvePayload(responseRecord: Record<string, unknown>): Record<string, unknown> {
    const dataCandidate = responseRecord['data'];
    if (this.isObject(dataCandidate)) {
      return dataCandidate as Record<string, unknown>;
    }

    return responseRecord;
  }

  private normalizeCatalogsResponse(rawResponse: unknown): RegisterCatalogsResponse {
    const responseRecord = this.toRecord(rawResponse);
    const payload = this.resolvePayload(responseRecord);

    const careers = this.getStringArray(payload, 'careers');
    const academicInterests = this.getStringArray(payload, 'academicInterests');

    return {
      careers,
      academicInterests,
    };
  }

  private resolveUser(payload: Record<string, unknown>, fallbackEmail: string): LoginResponse['user'] {
    const nestedUser = this.toRecord(payload['user']);
    const email = this.getString(nestedUser, 'email') || this.getString(payload, 'email') || fallbackEmail;
    if (!email) return undefined;

    const profileComplete = this.resolveProfileComplete(payload, nestedUser);
    const roles = this.resolveRoles(payload, nestedUser);
    const username = this.getString(nestedUser, 'username') || this.getString(payload, 'username');
    const fullName = this.getString(nestedUser, 'fullName') || this.getString(payload, 'fullName');
    const id = this.getString(nestedUser, 'id') || this.getString(payload, 'userId');

    return {
      id: id || undefined,
      email,
      username: username || undefined,
      fullName: fullName || undefined,
      roles,
      profileComplete,
    };
  }

  private resolveTokens(payload: Record<string, unknown>): RegisterResponse['tokens'] {
    const nestedTokens = this.toRecord(payload['tokens']);

    const accessToken = this.getString(nestedTokens, 'accessToken')
      || this.getString(payload, 'accessToken')
      || this.getString(payload, 'access_token');

    const refreshToken = this.getString(nestedTokens, 'refreshToken')
      || this.getString(payload, 'refreshToken')
      || this.getString(payload, 'refresh_token');

    const tokenType = this.getString(nestedTokens, 'tokenType')
      || this.getString(payload, 'tokenType')
      || this.getString(payload, 'token_type');

    if (!accessToken && !refreshToken && !tokenType) {
      return undefined;
    }

    return {
      accessToken: accessToken || undefined,
      refreshToken: refreshToken || undefined,
      tokenType: tokenType || undefined,
    };
  }

  private resolveProfileComplete(
    payload: Record<string, unknown>,
    nestedUser: Record<string, unknown>
  ): boolean | undefined {
    const direct = this.getBoolean(payload, 'profileComplete');
    if (direct !== undefined) return direct;

    const snake = this.getBoolean(payload, 'profile_complete');
    if (snake !== undefined) return snake;

    const nestedDirect = this.getBoolean(nestedUser, 'profileComplete');
    if (nestedDirect !== undefined) return nestedDirect;

    const nestedSnake = this.getBoolean(nestedUser, 'profile_complete');
    if (nestedSnake !== undefined) return nestedSnake;

    const username = this.getString(nestedUser, 'username') || this.getString(payload, 'username');
    const fullName = this.getString(nestedUser, 'fullName') || this.getString(payload, 'fullName');

    if (!username && !fullName) return false;
    return undefined;
  }

  private resolveRoles(payload: Record<string, unknown>, nestedUser: Record<string, unknown>): string[] | undefined {
    const roles = nestedUser['roles'];
    if (Array.isArray(roles)) {
      return roles.filter((role): role is string => typeof role === 'string' && !!role.trim());
    }

    const role = this.getString(payload, 'role') || this.getString(nestedUser, 'role');
    return role ? [role] : undefined;
  }

  private toRecord(value: unknown): Record<string, unknown> {
    return this.isObject(value) ? (value as Record<string, unknown>) : {};
  }

  private isObject(value: unknown): boolean {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  private getString(record: Record<string, unknown>, key: string): string {
    const value = record[key];
    return typeof value === 'string' ? value : '';
  }

  private getBoolean(record: Record<string, unknown>, key: string): boolean | undefined {
    const value = record[key];
    return typeof value === 'boolean' ? value : undefined;
  }

  private getStringArray(record: Record<string, unknown>, key: string): string[] {
    const value = record[key];
    if (!Array.isArray(value)) return [];

    return value
      .filter((entry): entry is string => typeof entry === 'string')
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
  }
}
