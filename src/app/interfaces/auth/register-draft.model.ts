export interface RegisterDraft {
	email: string;
	password: string;
	confirmPassword: string;
	firstName: string;
	lastName: string;
	career: string;
	bio: string;
	selectedInterests: string[];
	isActive: boolean;
	acceptedTerms: boolean;
	currentStep: number;
	expiresAt: number;
}
