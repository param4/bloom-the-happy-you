/**
 * Login visibility (see .env.example). When hidden, the app opens straight
 * into guest mode and the welcome/auth screens are unreachable. Hiding is
 * explicit opt-in (the exact string "true") so a build environment that's
 * missing the var can never silently ship with auth bypassed.
 */
export const HIDE_LOGIN = process.env.EXPO_PUBLIC_HIDE_LOGIN === 'true';
