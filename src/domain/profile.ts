/** The locally-stored projection of the user's account (identity comes from Clerk). */
export interface Profile {
  name: string;
  /** Empty string for guest sessions. */
  email: string;
  /** False until the 60-second onboarding flow has been completed. */
  onboarded: boolean;
  /** Clerk user id. Absent for local guest sessions. */
  id?: string;
  /** Clerk avatar image URL, when the account has one. */
  avatarUrl?: string;
}
