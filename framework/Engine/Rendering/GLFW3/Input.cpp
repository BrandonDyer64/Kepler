#ifdef WINDOW_MANAGER_GLFW3

#include "../Window.h"
#include "Engine/Game.h"
#include "Engine/Input/Keys.h"
#include <GLFW/glfw3.h>

namespace Kepler {

void Window::SetupInput() {
  // Keyboard
  glfwSetKeyCallback(
      (GLFWwindow *)window,
      [](GLFWwindow *window, int key, int scancode, int action, int mods) {
        Window *self = (Window *)glfwGetWindowUserPointer(window);
        if (action == GLFW_PRESS) {
          self->game->SetKeyState(getKeyName(scancode), true);
        } else if (action == GLFW_RELEASE) {
          self->game->SetKeyState(getKeyName(scancode), false);
        }
        std::cout << scancode << " " << getKeyName(scancode) << " "
                  << (self->game->GetKeyState(getKeyName(scancode)) ? "true"
                                                                    : "false")
                  << std::endl;
      });
}

} // namespace Kepler

#endif
