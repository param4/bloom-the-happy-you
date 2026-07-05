import type { Profile } from '@/domain/profile';
import type { IProfileRepository } from '@/repositories/interfaces';

import type { AuthResult, IProfileService, SocialProvider } from './interfaces';

/**
 * Local-profile auth (v1 has no backend). The only place that knows the
 * validation rules from the prototype; swapping in a real auth backend means
 * a new IProfileService impl — callers never change (OCP).
 */
export class ProfileService implements IProfileService {
  constructor(private readonly profiles: IProfileRepository) {}

  async signUp(name: string, email: string, password: string): Promise<AuthResult> {
    if (!name.trim()) return { ok: false, error: 'What should we call you?' };
    const emailError = validateEmail(email);
    if (emailError) return { ok: false, error: emailError };
    const passError = validatePassword(password);
    if (passError) return { ok: false, error: passError };

    const profile: Profile = { name: name.trim(), email: email.trim() };
    await this.profiles.save(profile);
    return { ok: true, profile };
  }

  async logIn(email: string, password: string): Promise<AuthResult> {
    const emailError = validateEmail(email);
    if (emailError) return { ok: false, error: emailError };
    const passError = validatePassword(password);
    if (passError) return { ok: false, error: passError };

    const profile: Profile = { name: email.split('@')[0], email: email.trim() };
    await this.profiles.save(profile);
    return { ok: true, profile };
  }

  async socialSignIn(provider: SocialProvider): Promise<Profile> {
    const profile: Profile = {
      name: `${provider} friend`,
      email: `you@${provider.toLowerCase()}.com`,
    };
    await this.profiles.save(profile);
    return profile;
  }

  async continueAsGuest(): Promise<Profile> {
    const profile: Profile = { name: 'friend', email: '' };
    await this.profiles.save(profile);
    return profile;
  }

  getCurrent(): Promise<Profile | null> {
    return this.profiles.get();
  }

  signOut(): Promise<void> {
    return this.profiles.clear();
  }
}

const validateEmail = (email: string): string | null =>
  !email.trim() || !email.includes('@') ? 'A valid email, please.' : null;

const validatePassword = (password: string): string | null =>
  password.length < 4 ? 'A password of at least 4 characters.' : null;
