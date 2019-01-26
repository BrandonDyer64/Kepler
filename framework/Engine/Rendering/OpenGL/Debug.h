#ifndef DebugOpenGL_h
#define DebugOpenGL_h

#include <glad/glad.h>

namespace Kepler {
  void GenerateDebugCallbacks();
  void APIENTRY CallbackFunction( GLenum source,
                                  GLenum type,
                                  GLuint id,
                                  GLenum severity,
                                  GLsizei length,
                                  const GLchar* message,
                                  const void* userParam);
}

#endif
