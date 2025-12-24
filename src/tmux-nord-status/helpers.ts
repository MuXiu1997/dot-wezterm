/** @noSelfInFile */

/**
 * Check if a string is blank (null, undefined or empty after trimming)
 * @param s The string to check
 * @returns True if the string is blank
 */
export function is_blank(s: string | null | undefined): boolean {
  return s == null || s.trim().length === 0
}

/**
 * Check if a Unicode character is a CJK character
 * @param char The Unicode code point
 * @returns True if the character is a CJK character
 */
export function is_cjk_char(char: number): boolean {
  return (char >= 0x4E00 && char <= 0x9FFF) // CJK Unified Ideographs
    || (char >= 0x3400 && char <= 0x4DBF) // CJK Unified Ideographs Extension A
    || (char >= 0x20000 && char <= 0x2A6DF) // CJK Unified Ideographs Extension B
    || (char >= 0xF900 && char <= 0xFAFF) // CJK Compatibility Ideographs
    || (char >= 0x2F800 && char <= 0x2FA1F) // CJK Compatibility Ideographs Supplement
}

/**
 * Get the display width of a Unicode character in monospace terminals
 * @param char The Unicode code point
 * @returns 2 for CJK characters, 1 for others
 */
export function get_char_width(char: number): number {
  return is_cjk_char(char) ? 2 : 1
}

/**
 * Calculate the display width of a string (considering UTF-8 characters)
 * @param str The string to measure
 * @returns The total display width
 */
export function string_width(str: string): number {
  let width = 0
  const codes = utf8.codes(str) as Iterable<LuaMultiReturn<[number, number]>>
  for (const [_, code] of codes) {
    width += get_char_width(code)
  }
  return width
}

/**
 * Truncate a string to a specified display width
 * @param str The string to truncate
 * @param max_width The maximum display width
 * @returns The truncated string
 */
export function truncate_string(str: string, max_width: number): string {
  if (max_width <= 0) {
    return ''
  }

  let result = ''
  let current_width = 0

  const codes = utf8.codes(str) as Iterable<LuaMultiReturn<[number, number]>>
  for (const [_, code] of codes) {
    const char_width = get_char_width(code)

    if (current_width + char_width > max_width) {
      break
    }

    result += utf8.char(code)
    current_width += char_width
  }

  return result
}
