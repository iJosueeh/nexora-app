export interface AuthResponseDto {
  accessToken?: string;
  tokenType?: string;
  expiresIn?: number;
  userId?: string;
  email?: string;
  role?: string;
  username?: string;
  fullName?: string;
  bio?: string;
  career?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  followersCount?: number;
  academicInterests?: string[];
  profileComplete?: boolean;
}

export interface ApiEnvelopeDto<T> {
  success?: boolean;
  message?: string;
  data?: T;
}
