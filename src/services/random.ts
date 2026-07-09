/**
 * Random selection as an injected dependency so services that "pick one at
 * random" stay deterministic in tests.
 */
export type IMomentPicker = <T>(items: T[]) => T | null;

export const randomPicker: IMomentPicker = (items) =>
  items.length ? items[Math.floor(Math.random() * items.length)] : null;

/**
 * A raw [0, 1) source, injected so weighted pickers (MomentService) stay
 * deterministic in tests. Defaults to Math.random in production.
 */
export type RandomFn = () => number;

export const randomSource: RandomFn = () => Math.random();
