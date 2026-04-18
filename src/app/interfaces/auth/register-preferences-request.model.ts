export interface RegisterPreferencesRequest {
  email: string;
  bio: string;
  academicInterests: string[];
  isActive: boolean;
  acceptedTerms: boolean;
}
