local M = {}

local function is_cjk_char(char)
    return (char >= 0x4E00 and char <= 0x9FFF) -- CJK Unified Ideographs
        or (char >= 0x3400 and char <= 0x4DBF) -- CJK Unified Ideographs Extension A
        or (char >= 0x20000 and char <= 0x2A6DF) -- CJK Unified Ideographs Extension B
        or (char >= 0xF900 and char <= 0xFAFF) -- CJK Compatibility Ideographs
        or (char >= 0x2F800 and char <= 0x2FA1F) -- CJK Compatibility Ideographs Supplement
end

local function get_char_width(char)
    return is_cjk_char(char) and 2 or 1
end

function M.string_width(str)
    local width = 0
    for _, code in utf8.codes(str) do
        width = width + get_char_width(code)
    end
    return width
end

function M.truncate_string(str, max_width)
    if max_width <= 0 then return "" end
    local result = ""
    local current_width = 0
    for _, code in utf8.codes(str) do
        local char_width = get_char_width(code)
        if current_width + char_width > max_width then break end
        result = result .. utf8.char(code)
        current_width = current_width + char_width
    end
    return result
end

return M
