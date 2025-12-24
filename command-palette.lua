--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
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

local function __TS__ArrayFilter(self, callbackfn, thisArg)
    local result = {}
    local len = 0
    for i = 1, #self do
        if callbackfn(thisArg, self[i], i - 1, self) then
            len = len + 1
            result[len] = self[i]
        end
    end
    return result
end
-- End of Lua Library inline imports
local ____exports = {}
---
-- @noSelfInFile
function ____exports.apply_to_config(_config)
    wezterm.on(
        "augment-command-palette",
        function(_window, _pane)
            return {
                {
                    brief = "Rename Tab",
                    action = wezterm.action:PromptInputLine({
                        description = "Enter new name for tab",
                        action = wezterm.action_callback(function(win, _pane, line)
                            if line then
                                win:active_tab():set_title(line)
                            end
                        end)
                    })
                },
                {
                    brief = "Set Tab to Directory Name",
                    action = wezterm.action_callback(function(win, p)
                        local cwd = p:get_current_working_dir()
                        if cwd then
                            local cwd_path = cwd.file_path or cwd.path or tostring(cwd)
                            local basename = table.remove(__TS__ArrayFilter(
                                __TS__StringSplit(cwd_path, "/"),
                                function(____, s) return s ~= "" end
                            ))
                            if basename and basename ~= "" then
                                win:active_tab():set_title(basename)
                            end
                        end
                    end)
                }
            }
        end
    )
end
return ____exports
