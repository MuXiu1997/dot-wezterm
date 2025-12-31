/** @noSelfInFile */

import type { Direction } from './navigation-helpers'
import { navigate_pane_with_wrap } from './navigation-helpers'

type DirectionKey = 'h' | 'j' | 'k' | 'l'
type Mode = 'tmux_mode' | 'tmux_tab_navigation_mode' | 'tmux_pane_navigation_mode' | 'tmux_pane_resize_mode'

const repeat_time = 600

const direction_keys: Record<Direction, DirectionKey> = {
  Left: 'h',
  Down: 'j',
  Up: 'k',
  Right: 'l',
}

function activate_key_table(mode: Mode): any {
  return wezterm.action.ActivateKeyTable({
    name: mode,
    one_shot: true,
    timeout_milliseconds: repeat_time,
    until_unknown: true,
    prevent_fallback: true,
  })
}

export function apply_to_config(config: wezterm.Config): void {
  // Main key bindings configuration
  config.keys = [
    ...(config.keys ?? []),
    {
      key: 'a',
      mods: 'CTRL',
      action: activate_key_table('tmux_mode'),
    },
  ]

  // Key tables configuration
  const key_table_tmux: any[] = []
  const key_table_tmux_tab_navigation: any[] = []
  const key_table_tmux_pane_navigation: any[] = []
  const key_table_tmux_pane_resize: any[] = []

  key_table_tmux.push(...[
    // Send Ctrl+a to terminal 🇨🇳发送 Ctrl+a 到终端（双击 Ctrl+a）
    {
      key: 'a',
      mods: 'CTRL',
      action: wezterm.action.SendKey({ key: 'a', mods: 'CTRL' }),
    },
    // Create new tab 🇨🇳新建标签页
    {
      key: 'c',
      mods: 'NONE',
      action: wezterm.action.SpawnTab('CurrentPaneDomain'),
    },
    // Toggle pane zoom 🇨🇳窗格缩放
    {
      key: 'z',
      mods: 'NONE',
      action: wezterm.action.TogglePaneZoomState,
    },
    // Pane selector 🇨🇳窗格选择器
    {
      key: 'q',
      mods: 'NONE',
      action: wezterm.action.PaneSelect({
        alphabet: '1234567890',
      }),
    },

    // Activate command palette 🇨🇳激活命令面板
    {
      key: 'p',
      mods: 'NONE',
      action: wezterm.action.ActivateCommandPalette,
    },

    // Split pane vertically 🇨🇳垂直分割窗格
    {
      key: '-',
      mods: 'NONE',
      action: wezterm.action.SplitVertical({ domain: 'CurrentPaneDomain' }),
    },

    // Split pane horizontally 🇨🇳水平分割窗格
    {
      key: '_',
      mods: 'NONE',
      action: wezterm.action.SplitHorizontal({ domain: 'CurrentPaneDomain' }),
    },
    {
      key: '|',
      mods: 'NONE',
      action: wezterm.action.SplitHorizontal({ domain: 'CurrentPaneDomain' }),
    },
  ])

  // Tab navigation 🇨🇳标签页导航
  ;(['Left', 'Right'] as Direction[])
    .map((dir) => {
      const offset = dir === 'Left' ? -1 : 1
      return {
        key: direction_keys[dir],
        mods: 'CTRL',
        action: wezterm.action.Multiple([
          wezterm.action.ActivateTabRelative(offset),
          activate_key_table('tmux_tab_navigation_mode'),
        ]),
      }
    })
    .forEach((bind) => {
      key_table_tmux.push(bind)
      key_table_tmux_tab_navigation.push(bind)
    })

  // Pane navigation 🇨🇳窗格导航
  ;(['Left', 'Down', 'Up', 'Right'] as Direction[])
    .map((dir) => {
      return {
        key: direction_keys[dir],
        mods: 'NONE',
        action: wezterm.action.Multiple([
          navigate_pane_with_wrap(dir),
          activate_key_table('tmux_pane_navigation_mode'),
        ]),
      }
    })
    .forEach((bind) => {
      key_table_tmux.push(bind)
      key_table_tmux_pane_navigation.push(bind)
    })

  // Pane resize 🇨🇳窗格调整大小
  ;(['Left', 'Down', 'Up', 'Right'] as Direction[])
    .map((dir) => {
      return {
        key: direction_keys[dir].toUpperCase(),
        mods: 'SHIFT',
        action: wezterm.action.Multiple([
          wezterm.action.AdjustPaneSize([dir, 2]),
          activate_key_table('tmux_pane_resize_mode'),
        ]),
      }
    })
    .forEach((bind) => {
      key_table_tmux.push(bind)
      key_table_tmux_pane_resize.push(bind)
    })

  config.key_tables = {
    ...(config.key_tables ?? {}),
    tmux_mode: key_table_tmux,
    tmux_tab_navigation_mode: key_table_tmux_tab_navigation,
    tmux_pane_navigation_mode: key_table_tmux_pane_navigation,
    tmux_pane_resize_mode: key_table_tmux_pane_resize,
  }
}
