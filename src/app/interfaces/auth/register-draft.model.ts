export interface RegisterDraft {
	email: string;
	password: string;
	confirmPassword: string;
	username: string;
	fullName: string;
	bio: string;
	selectedInterests: string[];
	isActive: boolean;
	acceptedTerms: boolean;
	currentStep: number;
	expiresAt: number;
}
