export interface RegisterRequest {
	email: string;
	password: string;
	username: string;
	fullName: string;
	bio: string;
	selectedInterests: string[];
	isActive: boolean;
	acceptedTerms: boolean;
}
