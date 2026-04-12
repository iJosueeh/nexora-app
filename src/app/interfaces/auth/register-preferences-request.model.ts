export interface RegisterPreferencesRequest {
  email: string;
  bio: string;
  selectedInterests: string[];
  isActive: boolean;
  acceptedTerms: boolean;
}
