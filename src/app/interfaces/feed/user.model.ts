import { AuthUser } from '../auth/auth-user.model';

export interface FeedUser extends AuthUser {
	avatar?: string;
	bio?: string;
	role?: string;
	verified?: boolean;
}
