local M = {}

function M.luaRequire(module)
  return _G.require(module)
end

return M