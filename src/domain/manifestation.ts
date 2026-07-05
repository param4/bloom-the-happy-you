/** A vision-board dream with its present-tense affirmation. */
export interface Manifestation {
  id: string;
  title: string;
  affirmation: string;
  why: string;
  achieved: boolean;
  /** Durable file URI of a picked image; accent gradient shown when absent. */
  imageUri?: string;
}
