import type { Manifestation } from '@/domain/manifestation';
import type { IManifestationRepository, ISettingsRepository } from '@/repositories/interfaces';

import type { RandomFn } from './random';
import type { IMomentService } from './interfaces';

/**
 * How many recently-shown dreams carry a recency penalty. The last shown is
 * penalised most; the penalty recovers linearly back to full weight as a dream
 * ages out of this window.
 */
export const RECENCY_WINDOW = 5;

/** Weight floor for the just-shown dream (rank 0) — "quite less" probability. */
const MIN_WEIGHT = 0.15;

/**
 * Weight for a dream given its position in the recency list (0 = shown most
 * recently). Not-recent dreams (rank < 0) get full weight; recent ones ramp
 * from MIN_WEIGHT back up to ~1 as they age out of the window.
 */
export function recencyWeight(rank: number): number {
  if (rank < 0 || rank >= RECENCY_WINDOW) return 1;
  return MIN_WEIGHT + (1 - MIN_WEIGHT) * (rank / RECENCY_WINDOW);
}

/**
 * The manifestation moment — a weighted-random dream the user is still calling
 * in. Recently-shown dreams are down-weighted (the last shown most of all) so
 * the same one doesn't keep resurfacing, while every dream stays possible.
 */
export class MomentService implements IMomentService {
  constructor(
    private readonly manifestations: IManifestationRepository,
    private readonly settings: ISettingsRepository,
    private readonly random: RandomFn,
  ) {}

  async pickActiveDream(): Promise<Manifestation | null> {
    const eligible = (await this.manifestations.getAll()).filter((m) => !m.achieved);
    if (eligible.length === 0) return null;

    const settings = await this.settings.get();
    const recent = settings.recentDreamIds ?? [];

    const weights = eligible.map((m) => recencyWeight(recent.indexOf(m.id)));
    const chosen = this.weightedPick(eligible, weights);

    // Prepend the chosen dream and cap the list to the recency window.
    // Atomic update recomputed from the latest stored value, so a concurrent
    // settings writer (streak, theme, reminder) can't be clobbered.
    await this.settings.update((current) => ({
      ...current,
      recentDreamIds: [
        chosen.id,
        ...(current.recentDreamIds ?? []).filter((id) => id !== chosen.id),
      ].slice(0, RECENCY_WINDOW),
    }));

    return chosen;
  }

  /** Pick one item with probability proportional to its weight. */
  private weightedPick<T>(items: T[], weights: number[]): T {
    const total = weights.reduce((sum, w) => sum + w, 0);
    let threshold = this.random() * total;
    for (let i = 0; i < items.length; i++) {
      threshold -= weights[i];
      if (threshold < 0) return items[i];
    }
    return items[items.length - 1]; // float-rounding fallback
  }
}
