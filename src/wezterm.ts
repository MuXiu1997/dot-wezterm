/** @noSelfInFile */

import * as baseConfig from './base-config'

const config = wezterm.config_builder()

baseConfig.apply_to_config(config)

// eslint-disable-next-line no-restricted-syntax
export = config
