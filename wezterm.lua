--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local baseConfig = require("base-config")
local commandPalette = require("command-palette")
local smartRightClick = require("smart-right-click")
local tmuxLike = require("tmux-like.index")
local tmuxNordStatus = require("tmux-nord-status.index")
local config = wezterm.config_builder()
baseConfig.apply_to_config(config)
smartRightClick.apply_to_config(config)
commandPalette.apply_to_config(config)
tmuxLike.apply_to_config(config)
tmuxNordStatus.apply_to_config(config)
local ____exports = config
return ____exports
