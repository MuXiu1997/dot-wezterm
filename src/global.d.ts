/** @noSelfInFile */

declare namespace wezterm {
  /** @noSelf */
  function font_with_fallback(fonts: (string | { family: string, weight?: string })[]): any
  function config_builder(): Config
  /** @noSelf */
  function action_callback(cb: (window: Window, pane: Pane) => void): any

  const action: {
    CopyTo: (destination: string) => any
    ClearSelection: any
    (opts: { PasteFrom: string }): any
  }

  interface Window {
    get_selection_text_for_pane: (pane: Pane) => string
    perform_action: (action: any, pane: Pane) => void
  }

  interface Pane {}

  interface Config {
    window_decorations?: string
    color_scheme?: string
    font?: any
    font_size?: number
    line_height?: number
    cell_width?: number
    default_cursor_style?: string
    text_blink_rate?: number
    window_background_opacity?: number
    macos_window_background_blur?: number
    text_background_opacity?: number
    inactive_pane_hsb?: {
      saturation?: number
      brightness?: number
    }
    native_macos_fullscreen_mode?: boolean
    enable_tab_bar?: boolean
    use_fancy_tab_bar?: boolean
    tab_bar_at_bottom?: boolean
    hide_tab_bar_if_only_one_tab?: boolean
    tab_max_width?: number
    enable_scroll_bar?: boolean
    scrollback_lines?: number
    default_prog?: string[]
    mouse_bindings?: any[]
  }
}
