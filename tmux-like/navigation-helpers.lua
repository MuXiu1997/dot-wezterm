--[[ Generated with https://github.com/TypeScriptToLua/TypeScriptToLua ]]
-- Lua Library inline imports
local function __TS__ArraySort(self, compareFn)
    if compareFn ~= nil then
        table.sort(
            self,
            function(a, b) return compareFn(nil, a, b) < 0 end
        )
    else
        table.sort(self)
    end
    return self
end
-- End of Lua Library inline imports
local ____exports = {}
local ____lua_2Drequire = require("lua-require")
local luaRequire = ____lua_2Drequire.luaRequire
local w = luaRequire("wezterm")
--- Check if two ranges overlap
-- 
-- @param start1 Start position of first range
-- @param len1 Length of first range
-- @param start2 Start position of second range
-- @param len2 Length of second range
-- @returns True if ranges overlap
local function ranges_overlap(start1, len1, start2, len2)
    return not (start1 + len1 <= start2 or start1 >= start2 + len2)
end
--- Check if a pane is a candidate in the given direction
-- 
-- @param pane_info Pane information with position and dimensions
-- @param current_info Current pane information
-- @param dir Navigation direction
-- @returns True if pane is a valid candidate
local function is_candidate_in_direction(pane_info, current_info, dir)
    if dir == "Left" then
        return pane_info.left < current_info.left and ranges_overlap(pane_info.top, pane_info.height, current_info.top, current_info.height)
    elseif dir == "Right" then
        return pane_info.left > current_info.left and ranges_overlap(pane_info.top, pane_info.height, current_info.top, current_info.height)
    elseif dir == "Up" then
        return pane_info.top < current_info.top and ranges_overlap(pane_info.left, pane_info.width, current_info.left, current_info.width)
    elseif dir == "Down" then
        return pane_info.top > current_info.top and ranges_overlap(pane_info.left, pane_info.width, current_info.left, current_info.width)
    end
    return false
end
--- Calculate distance between two panes based on direction
-- 
-- @param candidate Candidate pane information
-- @param current_info Current pane information
-- @param dir Navigation direction
-- @returns Manhattan distance between panes
local function calculate_distance(candidate, current_info, dir)
    if dir == "Left" or dir == "Right" then
        local horizontal_dist = math.abs(candidate.left - current_info.left)
        local vertical_dist = math.abs(candidate.top + candidate.height / 2 - (current_info.top + current_info.height / 2))
        return horizontal_dist + vertical_dist
    else
        local vertical_dist = math.abs(candidate.top - current_info.top)
        local horizontal_dist = math.abs(candidate.left + candidate.width / 2 - (current_info.left + current_info.width / 2))
        return vertical_dist + horizontal_dist
    end
end
--- Find the closest pane from candidates
-- 
-- @param candidates List of candidate panes
-- @param current_info Current pane information
-- @param dir Navigation direction
-- @returns The closest pane or undefined if no candidates
local function find_closest_pane(candidates, current_info, dir)
    if #candidates == 0 then
        return nil
    end
    local best_candidate = candidates[1]
    local best_distance = calculate_distance(best_candidate, current_info, dir)
    do
        local i = 1
        while i < #candidates do
            local distance = calculate_distance(candidates[i + 1], current_info, dir)
            if distance < best_distance then
                best_distance = distance
                best_candidate = candidates[i + 1]
            end
            i = i + 1
        end
    end
    return best_candidate.pane
end
--- Get wrap candidates for cyclic navigation
-- 
-- @param panes All panes in the tab
-- @param current_pane Current pane object
-- @param current_info Current pane information
-- @param dir Navigation direction
-- @returns Sorted list of wrap candidates
local function get_wrap_candidates(panes, current_pane, current_info, dir)
    local wrap_candidates = {}
    for ____, pane_info in ipairs(panes) do
        if pane_info.pane:pane_id() ~= current_pane:pane_id() then
            local include = false
            if dir == "Left" or dir == "Right" then
                include = ranges_overlap(pane_info.top, pane_info.height, current_info.top, current_info.height)
            else
                include = ranges_overlap(pane_info.left, pane_info.width, current_info.left, current_info.width)
            end
            if include then
                wrap_candidates[#wrap_candidates + 1] = pane_info
            end
        end
    end
    if dir == "Left" then
        __TS__ArraySort(
            wrap_candidates,
            function(____, a, b) return b.left - a.left end
        )
    elseif dir == "Right" then
        __TS__ArraySort(
            wrap_candidates,
            function(____, a, b) return a.left - b.left end
        )
    elseif dir == "Up" then
        __TS__ArraySort(
            wrap_candidates,
            function(____, a, b) return b.top - a.top end
        )
    elseif dir == "Down" then
        __TS__ArraySort(
            wrap_candidates,
            function(____, a, b) return a.top - b.top end
        )
    end
    return wrap_candidates
end
--- Get the next pane in the specified direction (with wrapping support)
-- 
-- @param tab WezTerm tab object
-- @param current_pane Current pane object
-- @param dir Navigation direction
-- @returns The next pane to navigate to, or undefined if none found
local function get_next_pane_in_direction(tab, current_pane, dir)
    local panes = tab:panes_with_info()
    local current_info
    for ____, pane_info in ipairs(panes) do
        if pane_info.pane:pane_id() == current_pane:pane_id() then
            current_info = pane_info
            break
        end
    end
    if not current_info then
        return nil
    end
    local candidates = {}
    for ____, pane_info in ipairs(panes) do
        if pane_info.pane:pane_id() ~= current_pane:pane_id() then
            if is_candidate_in_direction(pane_info, current_info, dir) then
                candidates[#candidates + 1] = pane_info
            end
        end
    end
    local closest = find_closest_pane(candidates, current_info, dir)
    if closest then
        return closest
    end
    local wrap_candidates = get_wrap_candidates(panes, current_pane, current_info, dir)
    if #wrap_candidates > 0 then
        return wrap_candidates[1].pane
    end
    return nil
end
--- Navigate to pane with wrapping support
-- 
-- @param dir Navigation direction ('Left', 'Right', 'Up', or 'Down')
-- @returns WezTerm action callback function
function ____exports.navigate_pane_with_wrap(dir)
    return w.action_callback(function(win, pane)
        local tab = win:active_tab()
        local next_pane = get_next_pane_in_direction(tab, pane, dir)
        if next_pane then
            next_pane:activate()
        end
    end)
end
return ____exports
