--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
local function __TS__StringTrim(self)
    local result = string.gsub(self, "^[%s ﻿]*(.-)[%s ﻿]*$", "%1")
    return result
end

local function __TS__StringStartsWith(self, searchString, position)
    if position == nil or position < 0 then
        position = 0
    end
    return string.sub(self, position + 1, #searchString + position) == searchString
end

local function __TS__StringSubstring(self, start, ____end)
    if ____end ~= ____end then
        ____end = 0
    end
    if ____end ~= nil and start > ____end then
        start, ____end = ____end, start
    end
    if start >= 0 then
        start = start + 1
    else
        start = 1
    end
    if ____end ~= nil and ____end < 0 then
        ____end = 0
    end
    return string.sub(self, start, ____end)
end

local __TS__StringSplit
do
    local sub = string.sub
    local find = string.find
    function __TS__StringSplit(source, separator, limit)
        if limit == nil then
            limit = 4294967295
        end
        if limit == 0 then
            return {}
        end
        local result = {}
        local resultIndex = 1
        if separator == nil or separator == "" then
            for i = 1, #source do
                result[resultIndex] = sub(source, i, i)
                resultIndex = resultIndex + 1
            end
        else
            local currentPos = 1
            while resultIndex <= limit do
                local startPos, endPos = find(source, separator, currentPos, true)
                if not startPos then
                    break
                end
                result[resultIndex] = sub(source, currentPos, startPos - 1)
                resultIndex = resultIndex + 1
                currentPos = endPos + 1
            end
            if resultIndex <= limit then
                result[resultIndex] = sub(source, currentPos)
            end
        end
        return result
    end
end

local function __TS__ArrayForEach(self, callbackFn, thisArg)
    for i = 1, #self do
        callbackFn(thisArg, self[i], i - 1, self)
    end
end

local function __TS__ArrayPushArray(self, items)
    local len = #self
    for i = 1, #items do
        len = len + 1
        self[len] = items[i]
    end
    return len
end
-- End of Lua Library inline imports
local ____exports = {}
local ____lua_2Drequire = require("lua-require")
local luaRequire = ____lua_2Drequire.luaRequire
local ____helpers = require("tmux-nord-status.helpers")
local is_blank = ____helpers.is_blank
local ____nord_2Dtheme_2Dcolors = require("tmux-nord-status.nord-theme-colors")
local NordColors = ____nord_2Dtheme_2Dcolors.NordColors
local ____utf8_2Dhelpers = require("tmux-nord-status.utf8-helpers")
local truncate_string = ____utf8_2Dhelpers.truncate_string
local w = luaRequire("wezterm")
local color_map = {
    black = NordColors.nord1,
    red = NordColors.nord11,
    green = NordColors.nord14,
    yellow = NordColors.nord13,
    blue = NordColors.nord9,
    magenta = NordColors.nord15,
    cyan = NordColors.nord8,
    white = NordColors.nord5,
    brightblack = NordColors.nord3,
    brightred = NordColors.nord11,
    brightgreen = NordColors.nord14,
    brightyellow = NordColors.nord13,
    brightblue = NordColors.nord9,
    brightmagenta = NordColors.nord15,
    brightcyan = NordColors.nord7,
    brightwhite = NordColors.nord6
}
local style_cache = {}
--- Parse color name to actual color value
-- 
-- @param color_name The color name or hex value
-- @returns The resolved color value or undefined
local function parse_color(color_name)
    if color_name == nil or #__TS__StringTrim(color_name) == 0 then
        return nil
    end
    if __TS__StringStartsWith(color_name, "#") then
        return color_name
    end
    return color_map[string.lower(color_name)] or color_name
end
--- Parse tmux style format string and return wezterm format element array
-- 
-- @param style_str The style string to parse
-- @returns Array of wezterm format elements
local function parse_tmux_style(style_str)
    if style_str == nil or #__TS__StringTrim(style_str) == 0 then
        return {}
    end
    if style_cache[style_str] then
        return style_cache[style_str]
    end
    local elements = {}
    local fg_color
    local bg_color
    local is_bold = false
    local is_italic = false
    local underline_style = "None"
    __TS__ArrayForEach(
        __TS__StringSplit(style_str, ","),
        function(____, p)
            local param = __TS__StringTrim(p)
            if __TS__StringStartsWith(param, "fg=") then
                fg_color = parse_color(__TS__StringSubstring(param, 3))
            elseif __TS__StringStartsWith(param, "bg=") then
                bg_color = parse_color(__TS__StringSubstring(param, 3))
            elseif param == "bold" then
                is_bold = true
            elseif param == "nobold" then
                is_bold = false
            elseif param == "italics" then
                is_italic = true
            elseif param == "noitalics" then
                is_italic = false
            elseif param == "underscore" then
                underline_style = "Single"
            elseif param == "nounderscore" then
                underline_style = "None"
            end
        end
    )
    if fg_color then
        elements[#elements + 1] = {Foreground = {Color = fg_color}}
    end
    if bg_color then
        elements[#elements + 1] = {Background = {Color = bg_color}}
    end
    if is_bold then
        elements[#elements + 1] = {Attribute = {Intensity = "Bold"}}
    end
    if is_italic then
        elements[#elements + 1] = {Attribute = {Italic = true}}
    end
    if underline_style ~= "None" then
        elements[#elements + 1] = {Attribute = {Underline = underline_style}}
    end
    style_cache[style_str] = elements
    return elements
end
local tmux_variables = {
    S = function(ctx)
        local ____opt_0 = ctx.window
        return ____opt_0 and ____opt_0:active_workspace() or "main"
    end,
    H = function() return w.hostname() or "localhost" end,
    I = function(ctx)
        local ____opt_2 = ctx.tab
        return tostring((____opt_2 and ____opt_2.tab_index or 0) + 1)
    end,
    W = function(ctx)
        if not ctx.tab then
            return "zsh"
        end
        local available_width = 16
        if ctx.max_width and ctx.max_width > 0 then
            available_width = ctx.max_width - 10
        end
        local title = ctx.tab.tab_title or ""
        if is_blank(title) then
            title = ctx.tab.active_pane.title
        end
        if available_width > 0 then
            title = truncate_string(title, available_width)
        end
        return title
    end,
    F = function(ctx)
        if not ctx.tab then
            return "-"
        end
        local flags = "-"
        if ctx.tab.is_active then
            flags = "*"
        end
        if ctx.tab.active_pane.is_zoomed then
            flags = flags .. "Z"
        end
        return flags
    end
}
local special_variables = {
    NORD_TMUX_STATUS_DATE_FORMAT = function(_ctx) return w.strftime("%Y-%m-%d") end,
    NORD_TMUX_STATUS_TIME_FORMAT = function(_ctx) return w.strftime("%H:%M:%S") end,
    prefix_highlight = function(ctx)
        local ____opt_4 = ctx.window
        local key_table = ____opt_4 and ____opt_4:active_key_table()
        if key_table then
            if key_table == "tmux_mode" then
                return " TMUX "
            elseif key_table == "copy_mode" then
                return " COPY "
            else
                return (" " .. string.upper(key_table)) .. " "
            end
        end
        return ""
    end
}
local function create_token(____type, value, raw)
    return {type = ____type, value = value, raw = raw or value}
end
local function tokenize_tmux_format(format_str)
    local tokens = {}
    local i = 0
    local len = #format_str
    while i < len do
        local char = __TS__StringSubstring(format_str, i, i + 1)
        if char == "#" then
            if i + 1 < len and __TS__StringSubstring(format_str, i + 1, i + 2) == "[" then
                local start = i
                local j = i + 2
                local bracket_count = 1
                while j < len and bracket_count > 0 do
                    local c = __TS__StringSubstring(format_str, j, j + 1)
                    if c == "[" then
                        bracket_count = bracket_count + 1
                    elseif c == "]" then
                        bracket_count = bracket_count - 1
                    end
                    if bracket_count > 0 then
                        j = j + 1
                    end
                end
                if j < len then
                    local style_content = __TS__StringSubstring(format_str, i + 2, j)
                    tokens[#tokens + 1] = create_token(
                        "STYLE",
                        style_content,
                        __TS__StringSubstring(format_str, start, j + 1)
                    )
                    i = j + 1
                else
                    tokens[#tokens + 1] = create_token("TEXT", char)
                    i = i + 1
                end
            elseif i + 1 < len and __TS__StringSubstring(format_str, i + 1, i + 2) == "{" then
                local start = i
                local j = i + 2
                local brace_count = 1
                while j < len and brace_count > 0 do
                    local c = __TS__StringSubstring(format_str, j, j + 1)
                    if c == "{" then
                        brace_count = brace_count + 1
                    elseif c == "}" then
                        brace_count = brace_count - 1
                    end
                    if brace_count > 0 then
                        j = j + 1
                    end
                end
                if j < len then
                    local content = __TS__StringSubstring(format_str, i + 2, j)
                    tokens[#tokens + 1] = create_token(
                        "CONDITION",
                        content,
                        __TS__StringSubstring(format_str, start, j + 1)
                    )
                    i = j + 1
                else
                    tokens[#tokens + 1] = create_token("TEXT", char)
                    i = i + 1
                end
            elseif i + 1 < len then
                local var_char = __TS__StringSubstring(format_str, i + 1, i + 2)
                if tmux_variables[var_char] then
                    tokens[#tokens + 1] = create_token(
                        "VARIABLE",
                        var_char,
                        __TS__StringSubstring(format_str, i, i + 2)
                    )
                    i = i + 2
                else
                    tokens[#tokens + 1] = create_token("TEXT", char)
                    i = i + 1
                end
            else
                tokens[#tokens + 1] = create_token("TEXT", char)
                i = i + 1
            end
        elseif char == "$" then
            if i + 1 < len and __TS__StringSubstring(format_str, i + 1, i + 2) == "{" then
                local start = i
                local j = i + 2
                local brace_count = 1
                while j < len and brace_count > 0 do
                    local c = __TS__StringSubstring(format_str, j, j + 1)
                    if c == "{" then
                        brace_count = brace_count + 1
                    elseif c == "}" then
                        brace_count = brace_count - 1
                    end
                    if brace_count > 0 then
                        j = j + 1
                    end
                end
                if j < len then
                    local content = __TS__StringSubstring(format_str, i + 2, j)
                    tokens[#tokens + 1] = create_token(
                        "LITERAL",
                        content,
                        __TS__StringSubstring(format_str, start, j + 1)
                    )
                    i = j + 1
                else
                    tokens[#tokens + 1] = create_token("TEXT", char)
                    i = i + 1
                end
            else
                tokens[#tokens + 1] = create_token("TEXT", char)
                i = i + 1
            end
        else
            local start = i
            while i < len and __TS__StringSubstring(format_str, i, i + 1) ~= "#" and __TS__StringSubstring(format_str, i, i + 1) ~= "$" do
                i = i + 1
            end
            local text = __TS__StringSubstring(format_str, start, i)
            if #text > 0 then
                tokens[#tokens + 1] = create_token("TEXT", text)
            end
        end
    end
    return tokens
end
--- Define a tmux format expression that can be evaluated with context
-- 
-- @param expr_str The tmux format string to parse
-- @returns An expression object with an eval method
function ____exports.define_tmux_format_expr(expr_str)
    local tokens = tokenize_tmux_format(expr_str)
    return {eval = function(____, ctx)
        local elements = {}
        __TS__ArrayForEach(
            tokens,
            function(____, token)
                if token.type == "TEXT" then
                    elements[#elements + 1] = {Text = token.value}
                elseif token.type == "STYLE" then
                    local style_elements = parse_tmux_style(token.value)
                    __TS__ArrayPushArray(elements, style_elements)
                elseif token.type == "VARIABLE" then
                    local func = tmux_variables[token.value]
                    if func ~= nil then
                        elements[#elements + 1] = {Text = func(ctx)}
                    else
                        elements[#elements + 1] = {Text = token.raw}
                    end
                elseif token.type == "CONDITION" or token.type == "LITERAL" then
                    local func = special_variables[token.value]
                    if func ~= nil then
                        elements[#elements + 1] = {Text = func(ctx)}
                    else
                        elements[#elements + 1] = {Text = token.raw}
                    end
                end
            end
        )
        return elements
    end}
end
return ____exports
