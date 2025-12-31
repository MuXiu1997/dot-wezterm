/** @noSelfInFile */

import { luaRequire } from '../lua-require'
import { is_blank } from './helpers'
import { NordColors } from './nord-theme-colors'
import { truncate_string } from './utf8-helpers'

const w = luaRequire<typeof wezterm>('wezterm')

// ============================================================================
// Type Definitions
// ============================================================================

export interface FormatContext {
  window?: wezterm.Window
  tab?: wezterm.TabInformation
  max_width?: number
}

const color_map: Record<string, NordColors> = {
  black: NordColors.nord1,
  red: NordColors.nord11,
  green: NordColors.nord14,
  yellow: NordColors.nord13,
  blue: NordColors.nord9,
  magenta: NordColors.nord15,
  cyan: NordColors.nord8,
  white: NordColors.nord5,
  brightblack: NordColors.nord3,
  brightred: NordColors.nord11,
  brightgreen: NordColors.nord14,
  brightyellow: NordColors.nord13,
  brightblue: NordColors.nord9,
  brightmagenta: NordColors.nord15,
  brightcyan: NordColors.nord7,
  brightwhite: NordColors.nord6,
}

type TokenType = 'TEXT' | 'STYLE' | 'VARIABLE' | 'CONDITION' | 'LITERAL'

interface Token {
  type: TokenType
  value: string
  raw: string
}

// ============================================================================
// Style Parsing
// ============================================================================

const style_cache: Record<string, any[]> = {}

/**
 * Parse color name to actual color value
 * @param color_name The color name or hex value
 * @returns The resolved color value or undefined
 */
function parse_color(color_name?: string): string | undefined {
  if (color_name === undefined || color_name.trim().length === 0) {
    return undefined
  }

  // Return hex color directly
  if (color_name.startsWith('#')) {
    return color_name
  }

  return color_map[color_name.toLowerCase()] || color_name
}

/**
 * Parse tmux style format string and return wezterm format element array
 * @param style_str The style string to parse
 * @returns Array of wezterm format elements
 */
function parse_tmux_style(style_str: string): any[] {
  if (style_str === undefined || style_str.trim().length === 0) {
    return []
  }

  if (style_cache[style_str]) {
    return style_cache[style_str]
  }

  const elements: any[] = []

  let fg_color: string | undefined
  let bg_color: string | undefined
  let is_bold = false
  let is_italic = false
  let underline_style: 'None' | 'Single' = 'None'

  style_str.split(',').forEach((p) => {
    const param = p.trim()

    if (param.startsWith('fg=')) {
      fg_color = parse_color(param.substring(3))
    }
    else if (param.startsWith('bg=')) {
      bg_color = parse_color(param.substring(3))
    }
    else if (param === 'bold') {
      is_bold = true
    }
    else if (param === 'nobold') {
      is_bold = false
    }
    else if (param === 'italics') {
      is_italic = true
    }
    else if (param === 'noitalics') {
      is_italic = false
    }
    else if (param === 'underscore') {
      underline_style = 'Single'
    }
    else if (param === 'nounderscore') {
      underline_style = 'None'
    }
  })

  if (fg_color) {
    elements.push({ Foreground: { Color: fg_color } })
  }

  if (bg_color) {
    elements.push({ Background: { Color: bg_color } })
  }

  if (is_bold) {
    elements.push({ Attribute: { Intensity: 'Bold' } })
  }

  if (is_italic) {
    elements.push({ Attribute: { Italic: true } })
  }

  if (underline_style !== 'None') {
    elements.push({ Attribute: { Underline: underline_style } })
  }

  style_cache[style_str] = elements
  return elements
}

// ============================================================================
// Variable Mapping
// ============================================================================

const tmux_variables: Record<string, (ctx: FormatContext) => string> = {
  // Get session name (using workspace name)
  S: ctx => ctx.window?.active_workspace() || 'main',
  // Get hostname
  H: () => w.hostname() || 'localhost',
  // Get tab index
  I: ctx => String(ctx.tab?.tab_index ?? 0),
  // Get tab title
  W: (ctx) => {
    if (!ctx.tab) {
      return 'zsh'
    }

    // Calculate the maximum available width for the title
    // Format: " #I  #W #F "
    // #I: tab index (1-2 chars)
    // #W: tab title (variable)
    // #F: flags (1-2 chars, like "*" or "*Z")
    // Spaces and separators: about 5 chars
    // Conservative estimate: reserve 10 chars for other elements
    let available_width = 16
    if (ctx.max_width && ctx.max_width > 0) {
      available_width = ctx.max_width - 10
    }

    // If the tab title is explicitly set, use that
    let title: string = ctx.tab.tab_title ?? ''
    if (is_blank(title)) {
      // Otherwise, use the title from the active pane
      title = ctx.tab.active_pane.title
    }
    // Truncate title if max width is specified
    if (available_width > 0) {
      title = truncate_string(title, available_width)
    }
    return title
  },
  // Get tab flags
  F: (ctx) => {
    if (!ctx.tab) {
      return '-'
    }

    let flags = '-'
    if (ctx.tab.is_active) {
      flags = '*'
    }
    if (ctx.tab.active_pane.is_zoomed) {
      flags += 'Z'
    }
    return flags
  },
}

const special_variables: Record<string, (ctx: FormatContext) => string> = {
  NORD_TMUX_STATUS_DATE_FORMAT: _ctx => w.strftime('%Y-%m-%d'),
  NORD_TMUX_STATUS_TIME_FORMAT: _ctx => w.strftime('%H:%M:%S'),
  prefix_highlight: (ctx) => {
    const key_table = ctx.window?.active_key_table()
    if (key_table) {
      if (key_table === 'tmux_mode') {
        return ' TMUX '
      }
      else if (key_table === 'copy_mode') {
        return ' COPY '
      }
      else {
        return ` ${key_table.toUpperCase()} `
      }
    }
    return ''
  },
}

// ============================================================================
// Tokenizer
// ============================================================================

function create_token(type: TokenType, value: string, raw?: string): Token {
  return {
    type,
    value,
    raw: raw || value,
  }
}

function tokenize_tmux_format(format_str: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  const len = format_str.length

  while (i < len) {
    const char = format_str.substring(i, i + 1)

    if (char === '#') {
      if (i + 1 < len && format_str.substring(i + 1, i + 2) === '[') {
        const start = i
        let j = i + 2
        let bracket_count = 1
        while (j < len && bracket_count > 0) {
          const c = format_str.substring(j, j + 1)
          if (c === '[') {
            bracket_count++
          }
          else if (c === ']') {
            bracket_count--
          }
          if (bracket_count > 0) {
            j++
          }
        }
        if (j < len) {
          const style_content = format_str.substring(i + 2, j)
          tokens.push(create_token('STYLE', style_content, format_str.substring(start, j + 1)))
          i = j + 1
        }
        else {
          tokens.push(create_token('TEXT', char))
          i++
        }
      }
      else if (i + 1 < len && format_str.substring(i + 1, i + 2) === '{') {
        const start = i
        let j = i + 2
        let brace_count = 1
        while (j < len && brace_count > 0) {
          const c = format_str.substring(j, j + 1)
          if (c === '{') {
            brace_count++
          }
          else if (c === '}') {
            brace_count--
          }
          if (brace_count > 0) {
            j++
          }
        }
        if (j < len) {
          const content = format_str.substring(i + 2, j)
          tokens.push(create_token('CONDITION', content, format_str.substring(start, j + 1)))
          i = j + 1
        }
        else {
          tokens.push(create_token('TEXT', char))
          i++
        }
      }
      else if (i + 1 < len) {
        const var_char = format_str.substring(i + 1, i + 2)
        if (tmux_variables[var_char]) {
          tokens.push(create_token('VARIABLE', var_char, format_str.substring(i, i + 2)))
          i += 2
        }
        else {
          tokens.push(create_token('TEXT', char))
          i++
        }
      }
      else {
        tokens.push(create_token('TEXT', char))
        i++
      }
    }
    else if (char === '$') {
      if (i + 1 < len && format_str.substring(i + 1, i + 2) === '{') {
        const start = i
        let j = i + 2
        let brace_count = 1
        while (j < len && brace_count > 0) {
          const c = format_str.substring(j, j + 1)
          if (c === '{') {
            brace_count++
          }
          else if (c === '}') {
            brace_count--
          }
          if (brace_count > 0) {
            j++
          }
        }
        if (j < len) {
          const content = format_str.substring(i + 2, j)
          tokens.push(create_token('LITERAL', content, format_str.substring(start, j + 1)))
          i = j + 1
        }
        else {
          tokens.push(create_token('TEXT', char))
          i++
        }
      }
      else {
        tokens.push(create_token('TEXT', char))
        i++
      }
    }
    else {
      const start = i
      while (i < len && format_str.substring(i, i + 1) !== '#' && format_str.substring(i, i + 1) !== '$') {
        i++
      }
      const text = format_str.substring(start, i)
      if (text.length > 0) {
        tokens.push(create_token('TEXT', text))
      }
    }
  }

  return tokens
}

export interface TmuxFormatExpr {
  eval: (ctx: FormatContext) => any[]
}

/**
 * Define a tmux format expression that can be evaluated with context
 * @param expr_str The tmux format string to parse
 * @returns An expression object with an eval method
 */
export function define_tmux_format_expr(expr_str: string): TmuxFormatExpr {
  const tokens = tokenize_tmux_format(expr_str)

  return {
    eval: (ctx: FormatContext) => {
      const elements: any[] = []

      tokens.forEach((token) => {
        if (token.type === 'TEXT') {
          elements.push({ Text: token.value })
        }
        else if (token.type === 'STYLE') {
          const style_elements = parse_tmux_style(token.value)
          elements.push(...style_elements)
        }
        else if (token.type === 'VARIABLE') {
          const func = tmux_variables[token.value]
          if (func != null) {
            elements.push({ Text: func(ctx) })
          }
          else {
            elements.push({ Text: token.raw })
          }
        }
        else if (token.type === 'CONDITION' || token.type === 'LITERAL') {
          const func = special_variables[token.value]
          if (func != null) {
            elements.push({ Text: func(ctx) })
          }
          else {
            elements.push({ Text: token.raw })
          }
        }
      })

      return elements
    },
  }
}
