/** @noSelfInFile */

import { luaRequire } from './lua-require'

const w = luaRequire<typeof wezterm>('wezterm')

export function apply_to_config(_config: wezterm.Config): void {
  w.on('augment-command-palette', (_window, _pane) => {
    return [
      {
        brief: 'Rename Tab',
        action: w.action.PromptInputLine({
          description: 'Enter new name for tab',
          action: w.action_callback((win, _pane, line) => {
            if (line) {
              win.active_tab().set_title(line)
            }
          }),
        }),
      },
      {
        brief: 'Set Tab to Directory Name',
        action: w.action_callback((win, p) => {
          const cwd = p.get_current_working_dir()
          if (cwd) {
            const cwd_path = cwd.file_path || cwd.path || String(cwd)
            const basename = cwd_path.split('/').filter(s => s !== '').pop()
            if (basename && basename !== '') {
              win.active_tab().set_title(basename)
            }
          }
        }),
      },
    ]
  })
}
