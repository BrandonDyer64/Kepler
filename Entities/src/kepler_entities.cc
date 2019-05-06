#include <napi.h>

using namespace Napi;

String Method(const CallbackInfo& info) {
  Env env = info.Env();
  return String::New(env, "world");
}

String Method2(const CallbackInfo& info) {
  Env env = info.Env();
  return String::New(env, "world2");
}

Object Init(Env env, Object exports) {
  exports.Set(String::New(env, "KeplerEntities"),
              Function::New(env, Method));
  exports.Set(String::New(env, "KeplerEntities2"),
              Function::New(env, Method2));
  return exports;
}

NODE_API_MODULE(addon, Init)
