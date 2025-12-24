/** @noSelfInFile */

import * as baseConfig from './base-config'
import * as smartRightClick from './smart-right-click'

const config = wezterm.config_builder()

baseConfig.apply_to_config(config)
smartRightClick.apply_to_config(config)

// eslint-disable-next-line no-restricted-syntax
export = config
