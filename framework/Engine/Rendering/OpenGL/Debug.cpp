#ifdef RENDER_API_OPENGL
#include <glad/glad.h>
#include "Debug.h"
#include <iostream>

namespace Kepler {


  void APIENTRY CallbackFunction( GLenum source,
                                  GLenum type,
                                  GLuint id,
                                  GLenum severity,
                                  GLsizei length,
                                  const GLchar* message,
                                  const void* userParam){
    using namespace std;
    cout << "OpenGL Encountered an Error" << endl;
    cout << "Severity: ";
    switch (severity){
      case GL_DEBUG_SEVERITY_LOW:
        cout << "[LOW]" << endl;
        break;
      case GL_DEBUG_SEVERITY_MEDIUM:
        cout << "[MEDIUM]" << endl;
        break;
      case GL_DEBUG_SEVERITY_HIGH:
        cout << "[HIGH]" << endl;
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

  void GenerateDebugCallbacks(){
    using namespace std;
    if(glDebugMessageCallback){
      cout << "Generating OpenGL debug callbacks" << endl;
      glEnable(GL_DEBUG_OUTPUT);
      glEnable(GL_DEBUG_OUTPUT_SYNCHRONOUS);
      glDebugMessageCallback(&CallbackFunction, nullptr);
      GLuint unusedIds = 0;
      glDebugMessageControl(GL_DONT_CARE, GL_DONT_CARE, GL_DONT_CARE, 0,
        &unusedIds, true);
      }
      cout << "Finished OpenGL debug callbacks" << endl;
    }

}//namespace Kepler

#endif
