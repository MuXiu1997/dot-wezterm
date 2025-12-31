--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
local ____exports = {}
local ____lua_2Drequire = require("lua-require")
local luaRequire = ____lua_2Drequire.luaRequire
local w = luaRequire("wezterm")
function ____exports.apply_to_config(config)
    config.window_decorations = "RESIZE"
    config.color_scheme = "nord"
    config.font = w.font_with_fallback({"JetBrains Mono", "Symbols Nerd Font Mono", "Source Han Sans CN"})
    config.font_size = 14
    config.line_height = 1
    config.cell_width = 1
    config.default_cursor_style = "BlinkingBar"
    config.text_blink_rate = 500
    config.window_background_opacity = 0.8
    config.macos_window_background_blur = 25
    config.text_background_opacity = 0.9
    config.inactive_pane_hsb = {saturation = 1, brightness = 0.6}
    config.native_macos_fullscreen_mode = false
    config.enable_tab_bar = true
    config.use_fancy_tab_bar = false
    config.tab_bar_at_bottom = true
    config.hide_tab_bar_if_only_one_tab = false
    config.tab_max_width = 40
    config.enable_scroll_bar = false
    config.scrollback_lines = 10000
    config.default_prog = {"zsh", "-l"}
end
return ____exports
