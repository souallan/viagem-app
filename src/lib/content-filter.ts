import { Filter } from "bad-words";

const filter = new Filter();

// Extend with common Portuguese profanity
filter.addWords(
  "porra", "caralho", "merda", "foda", "fodase", "foder", "buceta",
  "viado", "viadinho", "cuzão", "cú", "pau", "pica", "putaria",
  "puta", "putinha", "vagabunda", "safada", "safado", "arrombado",
  "corno", "cornão", "desgraça", "desgraçado", "filhadaputa",
  "bastardo", "idiota", "imbecil", "otário", "palhaço"
);

/**
 * Returns true if the text contains profanity (PT or EN).
 * Use this to reject content before saving.
 */
export function containsProfanity(text: string): boolean {
  try {
    return filter.isProfane(text);
  } catch {
    return false;
  }
}

/**
 * Replaces profane words with asterisks.
 * Prefer containsProfanity + rejection over silent replacement for user-facing fields.
 */
export function cleanProfanity(text: string): string {
  try {
    return filter.clean(text);
  } catch {
    return text;
  }
}
