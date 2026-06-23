/** @noSelfInFile */

import type { Direction } from './navigation-helpers'
import { luaRequire } from '../lua-require'
import { navigate_pane_with_wrap } from './navigation-helpers'

const w = luaRequire<typeof wezterm>('wezterm')

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
  return w.action.ActivateKeyTable({
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
      action: w.action.SendKey({ key: 'a', mods: 'CTRL' }),
    },
    // Create new tab 🇨🇳新建标签页
    {
      key: 'c',
      mods: 'NONE',
      action: w.action.SpawnTab('CurrentPaneDomain'),
    },
    // Toggle pane zoom 🇨🇳窗格缩放
    {
      key: 'z',
      mods: 'NONE',
      action: w.action.TogglePaneZoomState,
    },
    // Pane selector 🇨🇳窗格选择器
    {
      key: 'q',
      mods: 'NONE',
      action: w.action.PaneSelect({
        alphabet: '1234567890',
      }),
    },
    // Close current pane 🇨🇳关闭当前窗格
    {
      key: 'x',
      mods: 'NONE',
      action: w.action.CloseCurrentPane({ confirm: true }),
    },
    // Enter copy mode 🇨🇳进入复制模式
    {
      key: 'm',
      mods: 'NONE',
      action: w.action.ActivateCopyMode,
    },

    // Activate command palette 🇨🇳激活命令面板
    {
      key: 'p',
      mods: 'NONE',
      action: w.action.ActivateCommandPalette,
    },

    // Interactive Tab selector(Prefix + w) 🇨🇳交互式标签页选择器
    {
      key: 'w',
      mods: 'NONE',
      action: w.action.ShowLauncherArgs({ flags: 'FUZZY|TABS' }),
    },

    // Split pane vertically 🇨🇳垂直分割窗格
    {
      key: '-',
      mods: 'NONE',
      action: w.action.SplitVertical({ domain: 'CurrentPaneDomain' }),
    },

    // Split pane horizontally 🇨🇳水平分割窗格
    {
      key: '_',
      mods: 'NONE',
      action: w.action.SplitHorizontal({ domain: 'CurrentPaneDomain' }),
    },
    {
      key: '|',
      mods: 'NONE',
      action: w.action.SplitHorizontal({ domain: 'CurrentPaneDomain' }),
    },
  ])

  // Quick tab jump (Prefix + 1-9, 0) 🇨🇳快速标签页跳转
  ;[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    .map((i) => {
      return {
        key: i.toString().slice(-1),
        mods: 'NONE',
        action: w.action.ActivateTab(i - 1),
      }
    })
    .forEach((bind) => { key_table_tmux.push(bind) })

  // Tab navigation 🇨🇳标签页导航
  ;(['Left', 'Right'] as Direction[])
    .map((dir) => {
      const offset = dir === 'Left' ? -1 : 1
      return {
        key: direction_keys[dir],
        mods: 'CTRL',
        action: w.action.Multiple([
          w.action.ActivateTabRelative(offset),
          activate_key_table('tmux_tab_navigation_mode'),
        ]),
      }
    })
    .forEach((bind) => {
      key_table_tmux.push(bind)
      key_table_tmux_tab_navigation.push(bind)
    })

  // Tab reorder 🇨🇳移动当前标签页顺序
  ;[
    { key: '{', offset: -1 },
    { key: '}', offset: 1 },
  ]
    .map(({ key, offset }) => {
      return {
        key,
        mods: 'NONE',
        action: w.action.Multiple([
          w.action.MoveTabRelative(offset),
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
        action: w.action.Multiple([
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
        action: w.action.Multiple([
          w.action.AdjustPaneSize([dir, 2]),
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
