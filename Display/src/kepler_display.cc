#include "display/Display.hpp"

#include <napi.h>

using namespace Napi;

Boolean Test_GlfwInit(const CallbackInfo& info) {
  Env env = info.Env();
  GLFWwindow *window;
  return Boolean::New(env, glfwInit);
}

Object Init(Env env, Object exports) {
  exports.Set(String::New(env, "Test_GlfwInit"),
              Function::New(env, Test_GlfwInit));
  return exports;
}

NODE_API_MODULE(addon, Init)
