--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
local function __TS__ObjectAssign(target, ...)
    local sources = {...}
    for i = 1, #sources do
        local source = sources[i]
        for key in pairs(source) do
            target[key] = source[key]
        end
    end
    return target
end
-- End of Lua Library inline imports
local ____exports = {}
local ____lua_2Drequire = require("lua-require")
local luaRequire = ____lua_2Drequire.luaRequire
local ____nord_2Dtheme_2Dcolors = require("tmux-nord-status.nord-theme-colors")
local NordColors = ____nord_2Dtheme_2Dcolors.NordColors
local TmuxFormatExpr = require("tmux-nord-status.tmux-format-expr")
local w = luaRequire("wezterm")
local left_status_format_expr = TmuxFormatExpr.define_tmux_format_expr("#[fg=black,bg=blue,bold] #S #[fg=blue,bg=black,nobold,noitalics,nounderscore]")
local right_status_format_expr = TmuxFormatExpr.define_tmux_format_expr("#{prefix_highlight}#[fg=brightblack,bg=black,nobold,noitalics,nounderscore]#[fg=white,bg=brightblack] ${NORD_TMUX_STATUS_DATE_FORMAT} #[fg=white,bg=brightblack,nobold,noitalics,nounderscore]#[fg=white,bg=brightblack] ${NORD_TMUX_STATUS_TIME_FORMAT} #[fg=cyan,bg=brightblack,nobold,noitalics,nounderscore]#[fg=black,bg=cyan,bold] #H ")
local tab_title_format_expr = TmuxFormatExpr.define_tmux_format_expr("#[fg=black,bg=brightblack,nobold,noitalics,nounderscore] #[fg=white,bg=brightblack]#I #[fg=white,bg=brightblack,nobold,noitalics,nounderscore] #[fg=white,bg=brightblack]#W #F #[fg=brightblack,bg=black,nobold,noitalics,nounderscore]")
local current_tab_title_format_expr = TmuxFormatExpr.define_tmux_format_expr("#[fg=black,bg=cyan,nobold,noitalics,nounderscore] #[fg=black,bg=cyan]#I #[fg=black,bg=cyan,nobold,noitalics,nounderscore] #[fg=black,bg=cyan]#W #F #[fg=cyan,bg=black,nobold,noitalics,nounderscore]")
function ____exports.apply_to_config(config)
    config.status_update_interval = 250
    w.on(
        "update-status",
        function(window, _pane)
            window:set_left_status(w.format(left_status_format_expr:eval({window = window})))
            window:set_right_status(w.format(right_status_format_expr:eval({window = window})))
        end
    )
    w.on(
        "format-tab-title",
        function(tab, _tabs, _panes, _config, _hover, max_width)
            if not tab.is_active then
                return tab_title_format_expr:eval({tab = tab, max_width = max_width})
            else
                return current_tab_title_format_expr:eval({tab = tab, max_width = max_width})
            end
        end
    )
    local ____config_3 = config
    local ____temp_2 = config.colors or ({})
    local ____opt_0 = config.colors
    ____config_3.colors = __TS__ObjectAssign(
        {},
        ____temp_2,
        {tab_bar = __TS__ObjectAssign({}, ____opt_0 and ____opt_0.tab_bar or ({}), {background = NordColors.nord1, new_tab = {fg_color = NordColors.nord5, bg_color = NordColors.nord3}, new_tab_hover = {fg_color = NordColors.nord1, bg_color = NordColors.nord8}})}
    )
end
return ____exports
