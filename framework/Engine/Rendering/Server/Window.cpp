#ifdef WINDOW_MANAGER_

#include "../Window.h"
#include "Engine/Game.h"
#include <iostream>
#include <chrono>

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

auto time = std::chrono::high_resolution_clock::now();

double Window::GetTime() {
  auto time = std::chrono::high_resolution_clock::now();
  std::chrono::microseconds microseconds =
    std::chrono::duration_cast
    <std::chrono::microseconds>
    (time);
  return microseconds.count() / 1000000.0;
}

void CompileShader(Shader *shader) {}

} // namespace Kepler

#endif
