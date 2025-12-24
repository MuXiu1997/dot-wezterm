/** @noSelfInFile */

import * as baseConfig from './base-config'
import * as commandPalette from './command-palette'
import * as smartRightClick from './smart-right-click'
import * as tmuxLike from './tmux-like'
import * as tmuxNordStatus from './tmux-nord-status'

const config = wezterm.config_builder()

baseConfig.apply_to_config(config)
smartRightClick.apply_to_config(config)
commandPalette.apply_to_config(config)
tmuxLike.apply_to_config(config)
tmuxNordStatus.apply_to_config(config)

// eslint-disable-next-line no-restricted-syntax
export = config
