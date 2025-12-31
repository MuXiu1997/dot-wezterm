/** @noSelfInFile */

/**
 * Check if a string is blank (null, undefined or empty after trimming)
 * @param s The string to check
 * @returns True if the string is blank
 */
export function is_blank(s: string | null | undefined): boolean {
  return s == null || s.trim().length === 0
}
