--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
local function __TS__StringTrim(self)
    local result = string.gsub(self, "^[%s ﻿]*(.-)[%s ﻿]*$", "%1")
    return result
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
return ____exports
