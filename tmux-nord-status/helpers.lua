--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
local function __TS__StringTrim(self)
    local result = string.gsub(self, "^[%s ﻿]*(.-)[%s ﻿]*$", "%1")
    return result
end

local __TS__Symbol, Symbol
do
    local symbolMetatable = {__tostring = function(self)
        return ("Symbol(" .. (self.description or "")) .. ")"
    end}
    function __TS__Symbol(description)
        return setmetatable({description = description}, symbolMetatable)
    end
    Symbol = {
        asyncDispose = __TS__Symbol("Symbol.asyncDispose"),
        dispose = __TS__Symbol("Symbol.dispose"),
        iterator = __TS__Symbol("Symbol.iterator"),
        hasInstance = __TS__Symbol("Symbol.hasInstance"),
        species = __TS__Symbol("Symbol.species"),
        toStringTag = __TS__Symbol("Symbol.toStringTag")
    }
end

local __TS__Iterator
do
    local function iteratorGeneratorStep(self)
        local co = self.____coroutine
        local status, value = coroutine.resume(co)
        if not status then
            error(value, 0)
        end
        if coroutine.status(co) == "dead" then
            return
        end
        return true, value
    end
    local function iteratorIteratorStep(self)
        local result = self:next()
        if result.done then
            return
        end
        return true, result.value
    end
    local function iteratorStringStep(self, index)
        index = index + 1
        if index > #self then
            return
        end
        return index, string.sub(self, index, index)
    end
    function __TS__Iterator(iterable)
        if type(iterable) == "string" then
            return iteratorStringStep, iterable, 0
        elseif iterable.____coroutine ~= nil then
            return iteratorGeneratorStep, iterable
        elseif iterable[Symbol.iterator] then
            local iterator = iterable[Symbol.iterator](iterable)
            return iteratorIteratorStep, iterator
        else
            return ipairs(iterable)
        end
    end
end
-- End of Lua Library inline imports
local ____exports = {}
--- Check if a string is blank (null, undefined or empty after trimming)
-- 
-- @param s The string to check
-- @returns True if the string is blank
function ____exports.is_blank(s)
    return s == nil or #__TS__StringTrim(s) == 0
end
--- Check if a Unicode character is a CJK character
-- 
-- @param char The Unicode code point
-- @returns True if the character is a CJK character
function ____exports.is_cjk_char(char)
    return char >= 19968 and char <= 40959 or char >= 13312 and char <= 19903 or char >= 131072 and char <= 173791 or char >= 63744 and char <= 64255 or char >= 194560 and char <= 195103
end
--- Get the display width of a Unicode character in monospace terminals
-- 
-- @param char The Unicode code point
-- @returns 2 for CJK characters, 1 for others
function ____exports.get_char_width(char)
    return ____exports.is_cjk_char(char) and 2 or 1
end
--- Calculate the display width of a string (considering UTF-8 characters)
-- 
-- @param str The string to measure
-- @returns The total display width
function ____exports.string_width(str)
    local width = 0
    local codes = utf8.codes(str)
    for ____, ____value in __TS__Iterator(codes) do
        local _ = ____value[1]
        local code = ____value[2]
        width = width + ____exports.get_char_width(code)
    end
    return width
end
--- Truncate a string to a specified display width
-- 
-- @param str The string to truncate
-- @param max_width The maximum display width
-- @returns The truncated string
function ____exports.truncate_string(str, max_width)
    if max_width <= 0 then
        return ""
    end
    local result = ""
    local current_width = 0
    local codes = utf8.codes(str)
    for ____, ____value in __TS__Iterator(codes) do
        local _ = ____value[1]
        local code = ____value[2]
        local char_width = ____exports.get_char_width(code)
        if current_width + char_width > max_width then
            break
        end
        result = result .. utf8.char(code)
        current_width = current_width + char_width
    end
    return result
end
return ____exports
