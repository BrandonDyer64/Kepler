#ifdef WINDOW_MANAGER_GLFW3

// OpenGL
#include <glad/glad.h>
// Window
#include <GLFW/glfw3.h>

#include "../Window.h"
#include "Engine/Game.h"

namespace Kepler {

void glfwError(int id, const char *description) {
  std::cout << description << std::endl;
}

Window::Window(int w, int h, std::string t) {
  GLFWwindow *window = (GLFWwindow *)this->window;

  std::cout << "Open GLFW Window" << std::endl;

  glfwSetErrorCallback(&glfwError);

  // GLFW Hints
  glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
  glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 2);
  glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
  glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

  // Init GLFW
  if (!glfwInit()) {
    std::cout << "Failed to init GLFW" << std::endl;
    return;
  }

  // Create window
  window = glfwCreateWindow(w, h, t.c_str(), NULL, NULL);
  if (window == NULL) {
    glfwTerminate();
    std::cout << "Failed to create GLFW window" << std::endl;
    return;
  }

  // Set context
  glfwMakeContextCurrent(window);
  int status = gladLoadGLLoader((GLADloadproc)glfwGetProcAddress);

  glfwSetWindowUserPointer(window, this);

  this->window = (void *)window;

  SetupInput();
}

void Window::RenderBegin() { glClear(GL_COLOR_BUFFER_BIT); }
void Window::RenderEnd() { glfwSwapBuffers((GLFWwindow *)window); }
void Window::PollEvents() { glfwPollEvents(); }
bool Window::ShouldClose() {
  return glfwWindowShouldClose((GLFWwindow *)window);
}
void Window::Terminate() { glfwTerminate(); }

} // namespace Kepler

#endif
