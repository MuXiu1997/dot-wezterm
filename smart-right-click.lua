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
-- End of Lua Library inline imports
local ____exports = {}
local ____lua_2Drequire = require("lua-require")
local luaRequire = ____lua_2Drequire.luaRequire
local w = luaRequire("wezterm")
local function smart_right_click_handler()
    return w.action_callback(function(window, pane)
        local has_selection = window:get_selection_text_for_pane(pane) ~= ""
        if has_selection then
            window:perform_action(
                w.action.CopyTo("ClipboardAndPrimarySelection"),
                pane
            )
            window:perform_action(w.action.ClearSelection, pane)
        else
            window:perform_action(
                w.action({PasteFrom = "Clipboard"}),
                pane
            )
        end
    end)
end
function ____exports.apply_to_config(config)
    local ____config_1 = config
    local ____array_0 = __TS__SparseArrayNew(table.unpack(config.mouse_bindings or ({})))
    __TS__SparseArrayPush(
        ____array_0,
        {
            event = {Down = {streak = 1, button = "Right"}},
            mods = "NONE",
            action = smart_right_click_handler()
        }
    )
    ____config_1.mouse_bindings = {__TS__SparseArraySpread(____array_0)}
end
return ____exports
