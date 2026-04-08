import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../../core/tokens/api-endpoints.token';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly apiBaseUrl: string
  ) {}

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(this.buildUrl(path));
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.buildUrl(path), body);
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(this.buildUrl(path), body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(this.buildUrl(path));
  }

  private buildUrl(path: string): string {
    const base = this.apiBaseUrl.replace(/\/$/, '');
    const endpoint = path.replace(/^\//, '');
    return `${base}/${endpoint}`;
  }
}
