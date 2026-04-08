import { AuthTokens } from './auth-tokens.model';
import { AuthUser } from './auth-user.model';

export interface RegisterResponse {
	email?: string;
	user?: AuthUser;
	tokens?: AuthTokens;
}
