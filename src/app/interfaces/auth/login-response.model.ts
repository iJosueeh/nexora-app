import { AuthTokens } from './auth-tokens.model';
import { AuthUser } from './auth-user.model';

// Normalized auth response consumed by the app after mapping backend DTOs.
export interface LoginResponse {
	email?: string;
	user?: AuthUser;
	tokens?: AuthTokens;
}
