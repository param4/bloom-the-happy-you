/** A vision-board dream with its present-tense affirmation. */
export interface Manifestation {
  id: string;
  title: string;
  affirmation: string;
  why: string;
  achieved: boolean;
  /** Pastel backdrop when there is no image. */
  hue: string;
  /** Durable file URI of a picked image. */
  imageUri?: string;
}
