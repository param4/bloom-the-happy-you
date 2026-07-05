import type { Manifestation } from '@/domain/manifestation';
import type { IManifestationRepository } from '@/repositories/interfaces';

import type { IMomentPicker } from './random';
import type { IMomentService } from './interfaces';

/** The manifestation moment — a random dream the user is still calling in. */
export class MomentService implements IMomentService {
  constructor(
    private readonly manifestations: IManifestationRepository,
    private readonly pick: IMomentPicker,
  ) {}

  async pickActiveDream(): Promise<Manifestation | null> {
    const all = await this.manifestations.getAll();
    return this.pick(all.filter((m) => !m.achieved));
  }
}
