#ifdef WINDOW_MANAGER_

#include "../Window.h"
#include "Engine/Game.h"
#include <iostream>

namespace Kepler {

Window::Window(int w, int h, std::string t) {
  std::cout << "No Window Manager" << std::endl;
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

double time = 0;

double Window::GetTime() {
  // TODO: Replace server timer with chrono
  time += 0.01;
  return time;
}

} // namespace Kepler

#endif
