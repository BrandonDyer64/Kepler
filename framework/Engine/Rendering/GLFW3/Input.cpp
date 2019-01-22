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
          /*
          self->game->KeyTyped(
            std::string(glfwGetKeyName(key, 0)),
            mods & GLFW_MOD_SHIFT,
            mods & GLFW_MOD_CONTROL
          );
          */
        } else if (action == GLFW_RELEASE) {
          self->game->SetKeyState(getKeyName(scancode), false);
        }
      });

    // Gamepad
    glfwSetJoystickCallback(
      [](int joy, int event) {
        switch (event) {
        case GLFW_CONNECTED:
          std::cout << "Joystick connected" << std::endl;
          Game::game->AddJoystick((void *)&joy);
          break;
        case GLFW_DISCONNECTED:
          std::cout << "Joystick disconnected" << std::endl;
          break;
        }
      }
    );
}

} // namespace Kepler

#endif
