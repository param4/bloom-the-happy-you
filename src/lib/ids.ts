import * as Crypto from 'expo-crypto';

/** Collision-safe id generator (prototype used Date.now() strings). */
export const newId = (): string => Crypto.randomUUID();
