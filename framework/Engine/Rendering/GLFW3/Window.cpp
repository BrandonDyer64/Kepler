#ifdef WINDOW_MANAGER_GLFW3

// OpenGL
#include <glad/glad.h>
// Window
#include <GLFW/glfw3.h>

#include "../Window.h"
#include "Engine/Game.h"

namespace Kepler {

const std::string Window::windowAPI = "GLFW3";
const std::string Window::renderAPI = "OpenGL";

void glfwError(int id, const char *description) {
  std::cout << "GLFW Error: " << description << std::endl;
}

Window::Window(int w, int h, std::string t) {
  GLFWwindow *window = (GLFWwindow *)this->window;

  glfwSetErrorCallback(&glfwError);

  // Init GLFW
  if (!glfwInit()) {
    std::cout << "Failed to init GLFW" << std::endl;
    return;
  }

  // GLFW Hints
  glfwWindowHint(GLFW_SAMPLES, 4);

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

  float testPositions[6] = {
    -0.5f, -0.5f,
     0.0f,  0.5f,
     0.5f, -0.5f,
  };

  glGenBuffers(1, &buffer);
  glBindBuffer(GL_ARRAY_BUFFER, buffer);
  glBufferData(GL_ARRAY_BUFFER, 6 * sizeof(float), testPositions, GL_STATIC_DRAW);

  glEnableVertexAttribArray(0);
  glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, 2 * sizeof(float), 0);

  SetupInput();
}

void Window::RenderEnd() { glfwSwapBuffers((GLFWwindow *)window); }
void Window::PollEvents() { glfwPollEvents(); }
bool Window::ShouldClose() {
  return glfwWindowShouldClose((GLFWwindow *)window);
}
void Window::Terminate() { glfwTerminate(); }
double Window::GetTime() { return glfwGetTime(); }

} // namespace Kepler

#endif
