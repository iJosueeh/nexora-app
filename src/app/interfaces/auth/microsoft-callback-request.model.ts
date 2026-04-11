export interface MicrosoftCallbackRequest {
	code: string;
	state?: string;
	redirectUri: string;
}
