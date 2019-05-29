#ifndef Shader_h
#define Shader_h

#include "./Display.hpp"
#include <string>
#include <napi.h>

using namespace Napi;

class Shader {
  Shader(Object fs, std::string, std::string);
  Use();
}

#endif
