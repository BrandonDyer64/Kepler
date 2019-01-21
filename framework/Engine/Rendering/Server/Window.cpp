#ifdef WINDOW_MANAGER_

#include "../Window.h"
#include "Engine/Game.h"

namespace Kepler {

Window::Window(int w, int h, std::string t) {

}

void Window::RenderBegin() {  }
void Window::RenderEnd() {  }
void Window::PollEvents() {  }
bool Window::ShouldClose() {
  return false;
}
void Window::Terminate() {  }
void Window::SetupMesh(Mesh *mesh) {}
void Window::SetupInput() {}

} // namespace Kepler

#endif
