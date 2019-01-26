#ifndef DebugOpenGL_h
#define DebugOpenGL_h

#include <glad/glad.h>

namespace Kepler {
  void GenerateDebugCallbacks();
  void APIENTRY CallbackFunction();
}

#endif
