#include <napi.h>
#include "kepler/Kepler.hpp"
#include <entityx/Entity.h>
#include <display/Display.hpp>

using namespace Napi;

Boolean CheckEntityXInclude(const CallbackInfo& info) {
  Env env = info.Env();
  #ifdef Entity_h
    return Boolean::New(env, true);
  #else
    return Boolean::New(env, false);
  #endif
}

Boolean CheckDisplayInclude(const CallbackInfo& info) {
  Env env = info.Env();
  #ifdef Display_hpp
    return Boolean::New(env, true);
  #else
    return Boolean::New(env, false);
  #endif
}

Object Init(Env env, Object exports) {
  exports.Set(String::New(env, "CheckEntityXInclude"),
              Function::New(env, CheckEntityXInclude));
  exports.Set(String::New(env, "CheckDisplayInclude"),
              Function::New(env, CheckDisplayInclude));
  return exports;
}

NODE_API_MODULE(addon, Init)
