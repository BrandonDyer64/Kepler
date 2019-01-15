#ifdef WINDOW_MANAGER_GLFW3

#include "../Window.h"
// OpenGL
#include <glad/glad.h>
// Window
#include <GLFW/glfw3.h>

namespace Kepler {

class MeshGL {
public:
  MeshGL(unsigned int VAO, unsigned int VBO, unsigned int EBO)
      : VAO(VAO), VBO(VBO), EBO(EBO){};
  unsigned int VAO, VBO, EBO;
};

void glfwError(int id, const char *description) {
  std::cout << description << std::endl;
}
void key_callback(GLFWwindow *window, int key, int scancode, int action,
                  int mods) {
  std::cout << scancode << std::endl;
}

Window::Window(int w, int h, std::string t) {
  GLFWwindow *window = (GLFWwindow *)this->window;

  std::cout << "Open GLFW Window" << std::endl;

  glfwSetErrorCallback(&glfwError);

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

  glfwMakeContextCurrent(window);
  int status = gladLoadGLLoader((GLADloadproc)glfwGetProcAddress);

  glfwSetKeyCallback(window, key_callback);
  std::cout << "Window: " << window << std::endl;
  this->window = (void *)window;
}

void Window::SetupMesh(Mesh *mesh) {
  unsigned int VAO, VBO, EBO;
  glGenVertexArrays(1, &VAO);
  glGenBuffers(1, &VBO);
  glGenBuffers(1, &EBO);

  glBindVertexArray(VAO);
  glBindBuffer(GL_ARRAY_BUFFER, VBO);

  glBufferData(GL_ARRAY_BUFFER, mesh->vertices.size() * sizeof(Vertex),
               &mesh->vertices[0], GL_STATIC_DRAW);

  glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
  glBufferData(GL_ELEMENT_ARRAY_BUFFER,
               mesh->indices.size() * sizeof(unsigned int), &mesh->indices[0],
               GL_STATIC_DRAW);

  // vertex positions
  glEnableVertexAttribArray(0);
  glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex), (void *)0);
  // vertex normals
  glEnableVertexAttribArray(1);
  glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, sizeof(Vertex),
                        (void *)offsetof(Vertex, normal));
  // vertex texture coords
  glEnableVertexAttribArray(2);
  glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, sizeof(Vertex),
                        (void *)offsetof(Vertex, texCoord));

  glBindVertexArray(0);
  mesh->apiMesh = new MeshGL(VAO, VBO, EBO);
}

void Window::RenderBegin() { glClear(GL_COLOR_BUFFER_BIT); }
void Window::RenderEnd() { glfwSwapBuffers((GLFWwindow *)window); }
void Window::PollEvents() { glfwPollEvents(); }
bool Window::ShouldClose() {
  return glfwWindowShouldClose((GLFWwindow *)window);
}
void Window::Terminate() { glfwTerminate(); }
void Window::SetupMesh(Mesh *mesh);

} // namespace Kepler

#endif
