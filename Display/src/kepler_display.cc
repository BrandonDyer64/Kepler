#include "display/Display.hpp"

#include <napi.h>
#include <sstream>
#include <string>
#include <iostream>

using namespace Napi;

Boolean Test_GlfwInit(const CallbackInfo& info) {
  Env env = info.Env();
  GLFWwindow *window;
  return Boolean::New(env, glfwInit());
}

Boolean Test_GlfwIncluded(const CallbackInfo& info) {
  Env env = info.Env();
  #ifdef _glfw3_h_
    return Boolean::New(env, true);
  #else
    return Boolean::New(env, false);
  #endif
}

Boolean Test_GladIncluded(const CallbackInfo& info) {
  Env env = info.Env();
  #ifdef __glad_h_
    return Boolean::New(env, true);
  #else
    return Boolean::New(env, false);
  #endif
}

String GlfwGetVersion(const CallbackInfo& info) {
  Env env = info.Env();
  int major = 0, minor = 0, rev = 0;
  glfwGetVersion(&major, &minor, &rev);
  std::ostringstream str;
  str
    << major << '.'
    << minor << '.'
    << rev;
  return String::New(env, str.str());
}

Boolean GlfwTestOpenWindow(const CallbackInfo& info) {
  Env env = info.Env();
  GLFWwindow* window;

  /* Initialize the library */
  if (!glfwInit())
    return Boolean::New(env, false);

  /* Create a windowed mode window and its OpenGL context */
  window = glfwCreateWindow(640, 480, "Kepler Engine", NULL, NULL);
  if (!window)
  {
    glfwTerminate();
    return Boolean::New(env, false);
  }

  /* Make the window's context current */
  glfwMakeContextCurrent(window);
  gladLoadGL();
  glfwSwapInterval(1);

  /* Loop until the user closes the window */
  while (!glfwWindowShouldClose(window))
  {
    /* Render here */
    glClear(GL_COLOR_BUFFER_BIT);

    /* Swap front and back buffers */
    glfwSwapBuffers(window);

    /* Poll for and process events */
    glfwPollEvents();
  }

  glfwTerminate();
  return Boolean::New(env, true);
}

Object Init(Env env, Object exports) {
  exports.Set(String::New(env, "Test_GlfwInit"),
              Function::New(env, Test_GlfwInit));
  exports.Set(String::New(env, "Test_GlfwIncluded"),
              Function::New(env, Test_GlfwIncluded));
  exports.Set(String::New(env, "Test_GladIncluded"),
              Function::New(env, Test_GladIncluded));
  exports.Set(String::New(env, "GlfwGetVersion"),
              Function::New(env, GlfwGetVersion));
  exports.Set(String::New(env, "GlfwTestOpenWindow"),
              Function::New(env, GlfwTestOpenWindow));
  return exports;
}

NODE_API_MODULE(addon, Init)
