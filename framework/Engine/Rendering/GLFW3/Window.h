#ifdef WINDOW_INCLUDE

#include "../WindowBase.h"
#include <GL/glut.h>
#include <GLFW/glfw3.h>
#include <iostream>

namespace Kepler {

class Window : public WindowBase {
private:
  GLFWwindow *window;
  static void glfwError(int id, const char *description) {
    std::cout << description << std::endl;
  }

public:
  Window(int w, int h, std::string t) : WindowBase(w, h, t) {

    glfwSetErrorCallback(&glfwError);

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

    glfwMakeContextCurrent(window);
  }
  virtual void RenderBegin() { glClear(GL_COLOR_BUFFER_BIT); }
  virtual void RenderEnd() { glfwSwapBuffers(window); }
  virtual void PollEvents() { glfwPollEvents(); }
  virtual bool ShouldClose() { return glfwWindowShouldClose(window); }
  virtual void Terminate() { glfwTerminate(); }
};

} // namespace Kepler

#endif
