export interface AuthUser {
	id?: string;
	email: string;
	username?: string;
	fullName?: string;
	bio?: string;
	career?: string;
	avatarUrl?: string;
	bannerUrl?: string;
	followersCount?: number;
	academicInterests?: string[];
	roles?: string[];
	profileComplete?: boolean;
}
