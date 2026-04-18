export interface AuthUser {
	id?: string;
	email: string;
	username?: string;
	fullName?: string;
	roles?: string[];
	profileComplete?: boolean;
}
