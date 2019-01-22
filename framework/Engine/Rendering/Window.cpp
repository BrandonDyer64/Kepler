#include "Window.h"

namespace Kepler {

Shader &Window::GetShader(std::string &filename) {
  auto search = shaders.find(filename);
  if (search != shaders.end()) {
    return *search->second;
  } else {
    Shader *shader = new Shader(filename);
    CompileShader(shader);
    return *shader;
  }
}

}
