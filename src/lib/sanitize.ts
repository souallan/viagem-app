import sanitizeHtml from "sanitize-html";

/** Strips all HTML tags — use on plain-text user fields (names, titles, notes). */
export function stripHtml(value: unknown): string {
  if (typeof value !== "string") return "";
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim();
}

/** Trims + strips HTML from a string, returning null if empty after cleanup. */
export function cleanText(value: unknown): string | null {
  const s = stripHtml(value);
  return s.length > 0 ? s : null;
}
