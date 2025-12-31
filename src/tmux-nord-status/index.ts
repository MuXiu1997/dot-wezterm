/** @noSelfInFile */

import { luaRequire } from '../lua-require'
import { NordColors } from './nord-theme-colors'
import * as TmuxFormatExpr from './tmux-format-expr'

const w = luaRequire<typeof wezterm>('wezterm')

const left_status_format_expr = TmuxFormatExpr.define_tmux_format_expr(
  '#[fg=black,bg=blue,bold] #S #[fg=blue,bg=black,nobold,noitalics,nounderscore]',
)
const right_status_format_expr = TmuxFormatExpr.define_tmux_format_expr(
  // eslint-disable-next-line no-template-curly-in-string
  '#{prefix_highlight}#[fg=brightblack,bg=black,nobold,noitalics,nounderscore]#[fg=white,bg=brightblack] ${NORD_TMUX_STATUS_DATE_FORMAT} #[fg=white,bg=brightblack,nobold,noitalics,nounderscore]#[fg=white,bg=brightblack] ${NORD_TMUX_STATUS_TIME_FORMAT} #[fg=cyan,bg=brightblack,nobold,noitalics,nounderscore]#[fg=black,bg=cyan,bold] #H ',
)
const tab_title_format_expr = TmuxFormatExpr.define_tmux_format_expr(
  '#[fg=black,bg=brightblack,nobold,noitalics,nounderscore] #[fg=white,bg=brightblack]#I #[fg=white,bg=brightblack,nobold,noitalics,nounderscore] #[fg=white,bg=brightblack]#W #F #[fg=brightblack,bg=black,nobold,noitalics,nounderscore]',
)
const current_tab_title_format_expr = TmuxFormatExpr.define_tmux_format_expr(
  '#[fg=black,bg=cyan,nobold,noitalics,nounderscore] #[fg=black,bg=cyan]#I #[fg=black,bg=cyan,nobold,noitalics,nounderscore] #[fg=black,bg=cyan]#W #F #[fg=cyan,bg=black,nobold,noitalics,nounderscore]',
)

export function apply_to_config(config: wezterm.Config): void {
  config.status_update_interval = 250

  w.on('update-status', (window, _pane) => {
    window.set_left_status(w.format(left_status_format_expr.eval({
      window,
    })))
    window.set_right_status(w.format(right_status_format_expr.eval({
      window,
    })))
  })

  w.on('format-tab-title', (tab: wezterm.TabInformation, _tabs, _panes, _config, _hover, max_width) => {
    if (!tab.is_active) {
      return tab_title_format_expr.eval({
        tab,
        max_width,
      })
    }
    else {
      return current_tab_title_format_expr.eval({
        tab,
        max_width,
      })
    }
  })

  config.colors = {
    ...(config.colors ?? {}),
    tab_bar: {
      ...(config.colors?.tab_bar ?? {}),
      background: NordColors.nord1,
      new_tab: {
        fg_color: NordColors.nord5,
        bg_color: NordColors.nord3,
      },
      new_tab_hover: {
        fg_color: NordColors.nord1,
        bg_color: NordColors.nord8,
      },
    },
  }
}
