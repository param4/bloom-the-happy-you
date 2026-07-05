/**
 * Random selection as an injected dependency so services that "pick one at
 * random" stay deterministic in tests.
 */
export type IMomentPicker = <T>(items: T[]) => T | null;

export const randomPicker: IMomentPicker = (items) =>
  items.length ? items[Math.floor(Math.random() * items.length)] : null;
