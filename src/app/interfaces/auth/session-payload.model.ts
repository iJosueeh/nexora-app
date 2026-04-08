import { AuthTokens } from './auth-tokens.model';
import { AuthUser } from './auth-user.model';

export interface SessionPayload {
	user: AuthUser;
	tokens?: AuthTokens;
}
