/** @noSelfInFile */

declare namespace wezterm {
  function font_with_fallback(fonts: (string | { family: string, weight?: string })[]): any
  function config_builder(): Config
  function action_callback(cb: (window: Window, pane: Pane, ...args: any[]) => void): any
  function on(event: string, callback: (...args: any[]) => any): void
  function format(elements: any[]): string
  function strftime(format: string): string
  function hostname(): string
  function active_window(): Window

  /** @noSelf */
  interface Action {
    (opts: { PasteFrom: string }): any
    CopyTo: (destination: string) => any
    ClearSelection: any
    PromptInputLine: (opts: {
      description: string
      action: any
    }) => any
    ActivateKeyTable: (opts: {
      name: string
      one_shot?: boolean
      until_unknown?: boolean
      timeout_milliseconds?: number
      prevent_fallback?: boolean
    }) => any
    SendKey: (opts: { key: string, mods?: string }) => any
    SpawnTab: (domain: string | { DomainName: string }) => any
    TogglePaneZoomState: any
    PaneSelect: (opts: { alphabet?: string }) => any
    ActivateCommandPalette: any
    SplitVertical: (opts: { domain: string | { DomainName: string } }) => any
    SplitHorizontal: (opts: { domain: string | { DomainName: string } }) => any
    ActivateTabRelative: (offset: number) => any
    Multiple: (actions: any[]) => any
    AdjustPaneSize: (args: [string, number]) => any
  }

  const action: Action

  interface Window {
    get_selection_text_for_pane: (pane: Pane) => string
    perform_action: (action: any, pane: Pane) => void
    active_tab: () => Tab
    active_workspace: () => string
    active_key_table: () => string | undefined
    mux_window: () => MuxWindow
    set_left_status: (status: string) => void
    set_right_status: (status: string) => void
  }

  interface MuxWindow {
    tabs: () => MuxTab[]
  }

  interface MuxTab {
    tab_id: () => number
  }

  // Represents a Tab object with methods
  interface Tab {
    set_title: (title: string) => void
    panes_with_info: () => PaneInfo[]
    active_pane: () => Pane
    tab_id: number
  }

  interface TabInformation {
    tab_id: number
    tab_index: number
    is_active: boolean
    active_pane: PaneInformation
    tab_title?: string
    get_title: () => string
    get_size: () => { is_zoomed: boolean }
  }

  interface PaneInformation {
    pane_id: number
    title: string
    is_active: boolean
    is_zoomed: boolean
  }

  interface Pane {
    pane_id: () => number
    activate: () => void
    get_current_working_dir: () => {
      file_path?: string
      path?: string
    } | undefined
    title: string
  }

  interface PaneInfo {
    pane: Pane
    left: number
    top: number
    width: number
    height: number
    is_active: boolean
  }

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
    keys?: any[]
    key_tables?: Record<string, any[]>
    status_update_interval?: number
    colors?: {
      tab_bar?: {
        background?: string
        new_tab?: { fg_color?: string, bg_color?: string }
        new_tab_hover?: { fg_color?: string, bg_color?: string }
      }
    }
  }
}
