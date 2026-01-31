--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
local function __TS__CountVarargs(...)
    return select("#", ...)
end

local function __TS__SparseArrayNew(...)
    local sparseArray = {...}
    sparseArray.sparseLength = __TS__CountVarargs(...)
    return sparseArray
end

local function __TS__SparseArrayPush(sparseArray, ...)
    local args = {...}
    local argsLen = __TS__CountVarargs(...)
    local listLen = sparseArray.sparseLength
    for i = 1, argsLen do
        sparseArray[listLen + i] = args[i]
    end
    sparseArray.sparseLength = listLen + argsLen
end

local function __TS__SparseArraySpread(sparseArray)
    local _unpack = unpack or table.unpack
    return _unpack(sparseArray, 1, sparseArray.sparseLength)
end

local function __TS__ArrayPushArray(self, items)
    local len = #self
    for i = 1, #items do
        len = len + 1
        self[len] = items[i]
    end
    return len
end

local function __TS__ArrayMap(self, callbackfn, thisArg)
    local result = {}
    for i = 1, #self do
        result[i] = callbackfn(thisArg, self[i], i - 1, self)
    end
    return result
end

local function __TS__ArrayForEach(self, callbackFn, thisArg)
    for i = 1, #self do
        callbackFn(thisArg, self[i], i - 1, self)
    end
end

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
local ____navigation_2Dhelpers = require("tmux-like.navigation-helpers")
local navigate_pane_with_wrap = ____navigation_2Dhelpers.navigate_pane_with_wrap
local w = luaRequire("wezterm")
local repeat_time = 600
local direction_keys = {Left = "h", Down = "j", Up = "k", Right = "l"}
local function activate_key_table(mode)
    return w.action.ActivateKeyTable({
        name = mode,
        one_shot = true,
        timeout_milliseconds = repeat_time,
        until_unknown = true,
        prevent_fallback = true
    })
end
function ____exports.apply_to_config(config)
    local ____config_1 = config
    local ____array_0 = __TS__SparseArrayNew(table.unpack(config.keys or ({})))
    __TS__SparseArrayPush(
        ____array_0,
        {
            key = "a",
            mods = "CTRL",
            action = activate_key_table("tmux_mode")
        }
    )
    ____config_1.keys = {__TS__SparseArraySpread(____array_0)}
    local key_table_tmux = {}
    local key_table_tmux_tab_navigation = {}
    local key_table_tmux_pane_navigation = {}
    local key_table_tmux_pane_resize = {}
    __TS__ArrayPushArray(
        key_table_tmux,
        {
            {
                key = "a",
                mods = "CTRL",
                action = w.action.SendKey({key = "a", mods = "CTRL"})
            },
            {
                key = "c",
                mods = "NONE",
                action = w.action.SpawnTab("CurrentPaneDomain")
            },
            {key = "z", mods = "NONE", action = w.action.TogglePaneZoomState},
            {
                key = "q",
                mods = "NONE",
                action = w.action.PaneSelect({alphabet = "1234567890"})
            },
            {key = "p", mods = "NONE", action = w.action.ActivateCommandPalette},
            {
                key = "w",
                mods = "NONE",
                action = w.action.ShowLauncherArgs({flags = "FUZZY|TABS"})
            },
            {
                key = "-",
                mods = "NONE",
                action = w.action.SplitVertical({domain = "CurrentPaneDomain"})
            },
            {
                key = "_",
                mods = "NONE",
                action = w.action.SplitHorizontal({domain = "CurrentPaneDomain"})
            },
            {
                key = "|",
                mods = "NONE",
                action = w.action.SplitHorizontal({domain = "CurrentPaneDomain"})
            }
        }
    )
    __TS__ArrayForEach(
        __TS__ArrayMap(
            {
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10
            },
            function(____, i)
                return {
                    key = string.sub(
                        tostring(i),
                        -1
                    ),
                    mods = "NONE",
                    action = w.action.ActivateTab(i - 1)
                }
            end
        ),
        function(____, bind)
            key_table_tmux[#key_table_tmux + 1] = bind
        end
    )
    __TS__ArrayForEach(
        __TS__ArrayMap(
            {"Left", "Right"},
            function(____, dir)
                local offset = dir == "Left" and -1 or 1
                return {
                    key = direction_keys[dir],
                    mods = "CTRL",
                    action = w.action.Multiple({
                        w.action.ActivateTabRelative(offset),
                        activate_key_table("tmux_tab_navigation_mode")
                    })
                }
            end
        ),
        function(____, bind)
            key_table_tmux[#key_table_tmux + 1] = bind
            key_table_tmux_tab_navigation[#key_table_tmux_tab_navigation + 1] = bind
        end
    )
    __TS__ArrayForEach(
        __TS__ArrayMap(
            {"Left", "Down", "Up", "Right"},
            function(____, dir)
                return {
                    key = direction_keys[dir],
                    mods = "NONE",
                    action = w.action.Multiple({
                        navigate_pane_with_wrap(dir),
                        activate_key_table("tmux_pane_navigation_mode")
                    })
                }
            end
        ),
        function(____, bind)
            key_table_tmux[#key_table_tmux + 1] = bind
            key_table_tmux_pane_navigation[#key_table_tmux_pane_navigation + 1] = bind
        end
    )
    __TS__ArrayForEach(
        __TS__ArrayMap(
            {"Left", "Down", "Up", "Right"},
            function(____, dir)
                return {
                    key = string.upper(direction_keys[dir]),
                    mods = "SHIFT",
                    action = w.action.Multiple({
                        w.action.AdjustPaneSize({dir, 2}),
                        activate_key_table("tmux_pane_resize_mode")
                    })
                }
            end
        ),
        function(____, bind)
            key_table_tmux[#key_table_tmux + 1] = bind
            key_table_tmux_pane_resize[#key_table_tmux_pane_resize + 1] = bind
        end
    )
    config.key_tables = __TS__ObjectAssign({}, config.key_tables or ({}), {tmux_mode = key_table_tmux, tmux_tab_navigation_mode = key_table_tmux_tab_navigation, tmux_pane_navigation_mode = key_table_tmux_pane_navigation, tmux_pane_resize_mode = key_table_tmux_pane_resize})
end
return ____exports
