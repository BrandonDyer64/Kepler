#ifdef RENDER_API_OPENGL

#include "../Window.h"
#include <glad/glad.h>

namespace Kepler {

void Window::RenderBegin() {
  glClear(GL_COLOR_BUFFER_BIT);
  glDrawArrays(GL_TRIANGLES, 0, 3);
}

} // Namespace Kepler

#endif
