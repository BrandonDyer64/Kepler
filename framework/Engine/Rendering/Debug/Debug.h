#ifndef Debug_h
#define Debug_h

//OpenGL
#include <glad/glad.h>
#include <GLFW/glfw3.h>

namespace Kepler {

  void GenerateDebugCallbacks(){
    cout << "Generating OpenGL debug callbacks" << endl;
    glEnable(GL_DEBUG_OUTPUT_SYNCHRONOUS);
    glDebugMessageCallback(CallbackFunction, nullptr);
    GLuint unusedIds = 0;
    glDebugMessageControl(GL_DONT_CARE, GL_DONT_CARE, GL_DONT_CARE, 0,
      &unusedIds, true);
  }


  void APIENTRY CallbackFunction(GLenum source, GLenum type, GLuint id,
                                GLenum severity, GLsizei length,
                                const GLchar* message, const void* userParam){
    cout << "OpenGL Encountered an Error" << endl;
    cout << "Severity: ";
    switch (severity){
    case GL_DEBUG_SEVERITY_LOW:
        cout << "[LOW]";
        break;
      case GL_DEBUG_SEVERITY_MEDIUM:
        cout << "[MEDIUM]";
        break;
      case GL_DEBUG_SEVERITY_HIGH:
        cout << "[HIGH]";
        break;
    }
    cout << " Type: ";
    switch (type) {
      case GL_DEBUG_TYPE_ERROR:
        cout << "ERROR";
        break;
      case GL_DEBUG_TYPE_DEPRECATED_BEHAVIOR:
        cout << "DEPRECATED_BEHAVIOR";
        break;
      case GL_DEBUG_TYPE_UNDEFINED_BEHAVIOR:
        cout << "UNDEFINED_BEHAVIOR";
        break;
      case GL_DEBUG_TYPE_PORTABILITY:
        cout << "PORTABILITY";
        break;
      case GL_DEBUG_TYPE_PERFORMANCE:
        cout << "PERFORMANCE";
        break;
      case GL_DEBUG_TYPE_OTHER:
        cout << "OTHER";
        break;
    }
    cout << endl;
    cout << "Message: "<< message << endl;
    cout << "ID: " << id << endl;
  }
}
