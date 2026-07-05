import type { StreakState } from '@/domain/streak';
import { dayDiff, type DateKey } from '@/lib/dates';
import type { ISettingsRepository } from '@/repositories/interfaces';

import type { IStreakService } from './interfaces';

/**
 * The kind streak: one increment per calendar day, and missed days are
 * absorbed by grace days instead of resetting to zero.
 */
export class StreakService implements IStreakService {
  constructor(private readonly settings: ISettingsRepository) {}

  async getState(): Promise<StreakState> {
    return (await this.settings.get()).streak;
  }

  async recordActivity(dateKey: DateKey): Promise<StreakState> {
    const settings = await this.settings.get();
    const next = advanceStreak(settings.streak, dateKey);
    if (next !== settings.streak) {
      await this.settings.save({ ...settings, streak: next });
    }
    return next;
  }
}

/** Pure streak math — exported for unit testing. */
export function advanceStreak(state: StreakState, dateKey: DateKey): StreakState {
  const { count, graceDays, lastActiveDateKey } = state;

  if (lastActiveDateKey === null) {
    return { count: 1, graceDays, lastActiveDateKey: dateKey };
  }

  const gap = dayDiff(lastActiveDateKey, dateKey);
  if (gap <= 0) return state; // already counted today (or clock went back)
  if (gap === 1) return { count: count + 1, graceDays, lastActiveDateKey: dateKey };

  const missed = gap - 1;
  if (missed <= graceDays) {
    // Grace days absorb the miss — nothing breaks.
    return { count: count + 1, graceDays: graceDays - missed, lastActiveDateKey: dateKey };
  }
  return { count: 1, graceDays, lastActiveDateKey: dateKey };
}
