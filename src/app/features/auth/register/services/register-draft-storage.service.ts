import { Injectable } from '@angular/core';
import { RegisterDraft } from '../../../../interfaces/auth';

@Injectable({
  providedIn: 'root',
})
export class RegisterDraftStorageService {
  private readonly storageKey = 'nexora.register.draft.v1';
  private readonly draftDurationMs = 30 * 60 * 1000;

  load(): RegisterDraft | null {
    try {
      const rawDraft = sessionStorage.getItem(this.storageKey);
      if (!rawDraft) return null;

      const parsedDraft: unknown = JSON.parse(rawDraft);
      const record = this.toRecord(parsedDraft);
      if (!record) return null;

      const expiresAt = this.getNumber(record, 'expiresAt', 0);
      if (!expiresAt || Date.now() >= expiresAt) {
        this.clear();
        return null;
      }

      return {
        email: this.getString(record, 'email'),
        password: this.getString(record, 'password'),
        confirmPassword: this.getString(record, 'confirmPassword'),
        isEmailGuideVisible: this.getBoolean(record, 'isEmailGuideVisible', false),
        firstName: this.resolveFirstName(record),
        lastName: this.resolveLastName(record),
        career: this.getString(record, 'career'),
        bio: this.getString(record, 'bio'),
        selectedInterests: this.getStringArray(record, 'selectedInterests'),
        isActive: this.getBoolean(record, 'isActive', true),
        acceptedTerms: this.getBoolean(record, 'acceptedTerms', false),
        currentStep: this.getNumber(record, 'currentStep', 1),
        expiresAt,
      };
    } catch {
      return null;
    }
  }

  save(draft: Omit<RegisterDraft, 'expiresAt'>): number {
    const now = Date.now();
    const storedExpiresAt = this.readStoredExpiresAt();
    const expiresAt = storedExpiresAt && storedExpiresAt > now
      ? storedExpiresAt
      : now + this.draftDurationMs;

    sessionStorage.setItem(this.storageKey, JSON.stringify({ ...draft, expiresAt }));
    return expiresAt;
  }

  clear(): void {
    sessionStorage.removeItem(this.storageKey);
  }

  private toRecord(value: unknown): Record<string, unknown> | null {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return null;
    }

    return value as Record<string, unknown>;
  }

  private getString(record: Record<string, unknown>, key: string): string {
    const value = record[key];
    return typeof value === 'string' ? value : '';
  }

  private getStringArray(record: Record<string, unknown>, key: string): string[] {
    const value = record[key];
    if (!Array.isArray(value)) return [];

    return value.filter((entry): entry is string => typeof entry === 'string');
  }

  private getBoolean(record: Record<string, unknown>, key: string, fallback: boolean): boolean {
    const value = record[key];
    return typeof value === 'boolean' ? value : fallback;
  }

  private getNumber(record: Record<string, unknown>, key: string, fallback: number): number {
    const value = record[key];
    return typeof value === 'number' ? value : fallback;
  }

  private resolveFirstName(record: Record<string, unknown>): string {
    const firstName = this.getString(record, 'firstName');
    if (firstName) return firstName;

    const fullName = this.getString(record, 'fullName');
    if (fullName) return this.splitFullName(fullName).firstName;

    const username = this.getString(record, 'username');
    return this.splitFullName(username).firstName;
  }

  private resolveLastName(record: Record<string, unknown>): string {
    const lastName = this.getString(record, 'lastName');
    if (lastName) return lastName;

    const fullName = this.getString(record, 'fullName');
    if (fullName) return this.splitFullName(fullName).lastName;

    const username = this.getString(record, 'username');
    return this.splitFullName(username).lastName;
  }

  private splitFullName(value: string): { firstName: string; lastName: string } {
    const [firstName = '', ...rest] = value.trim().split(/\s+/);
    return {
      firstName,
      lastName: rest.join(' '),
    };
  }

  private readStoredExpiresAt(): number | null {
    try {
      const rawDraft = sessionStorage.getItem(this.storageKey);
      if (!rawDraft) return null;

      const parsedDraft: unknown = JSON.parse(rawDraft);
      const record = this.toRecord(parsedDraft);
      if (!record) return null;

      const expiresAt = record['expiresAt'];
      return typeof expiresAt === 'number' ? expiresAt : null;
    } catch {
      return null;
    }
  }
}
