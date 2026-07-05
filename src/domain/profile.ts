/** The locally-stored user profile (no backend in v1). */
export interface Profile {
  name: string;
  /** Empty string for guest sessions. */
  email: string;
  /** False until the 60-second onboarding flow has been completed. */
  onboarded: boolean;
}
