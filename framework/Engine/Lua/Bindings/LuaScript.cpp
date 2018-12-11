#include "LuaScript.h"

namespace Kepler {

LuaScript::LuaScript(const std::string &filename) {
  L = luaL_newstate();
  if (luaL_loadfile(L, filename.c_str()) || lua_pcall(L, 0, 0, 0)) {
    std::cout << "Error: failed to load (" << filename << ")" << std::endl;
    L = 0;
  }

  if (L)
    luaL_openlibs(L);
}

LuaScript::~LuaScript() {
  if (L)
    lua_close(L);
}

void LuaScript::PrintError(const std::string &variableName,
                           const std::string &reason) {
  std::cout << "Error: can't get [" << variableName << "]. " << reason
            << std::endl;
}

std::vector<int> LuaScript::GetIntVector(const std::string &name) {
  std::vector<int> v;
  lua_gettostack(name.c_str());
  if (lua_isnil(L, -1)) { // array is not found
    return std::vector<int>();
  }
  lua_pushnil(L);
  while (lua_next(L, -2)) {
    v.push_back((int)lua_tonumber(L, -1));
    lua_pop(L, 1);
  }
  Clean();
  return v;
}

std::vector<std::string> LuaScript::GetTableKeys(const std::string &name) {
  std::string code = "function getKeys(name) "
                     "s = \"\""
                     "for k, v in pairs(_G[name]) do "
                     "    s = s..k..\",\" "
                     "    end "
                     "return s "
                     "end"; // function for getting table keys
  luaL_loadstring(L,
                  code.c_str()); // execute code
  lua_pcall(L, 0, 0, 0);
  lua_getglobal(L, "getKeys"); // get function
  lua_pushstring(L, name.c_str());
  lua_pcall(L, 1, 1, 0); // execute function
  std::string test = lua_tostring(L, -1);
  std::vector<std::string> strings;
  std::string temp = "";
  std::cout << "TEMP:" << test << std::endl;
  for (unsigned int i = 0; i < test.size(); i++) {
    if (test.at(i) != ',') {
      temp += test.at(i);
    } else {
      strings.push_back(temp);
      temp = "";
    }
  }
  Clean();
  return strings;
}

} // namespace Kepler
