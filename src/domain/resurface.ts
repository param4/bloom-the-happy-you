import type { Entry, EntryKind } from './entry';
import type { JoyVideo } from './video';

/** A happy moment picked to lift the user up on a low day. */
export type ResurfaceItem =
  | { kind: 'entry'; pillar: EntryKind; entry: Entry }
  | { kind: 'video'; video: JoyVideo };
