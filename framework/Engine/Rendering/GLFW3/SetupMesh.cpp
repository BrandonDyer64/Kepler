#ifdef WINDOW_MANAGER_GLFW3

#include "../Window.h"
#include <glad/glad.h>

namespace Kepler {

class MeshGL {
public:
  MeshGL(unsigned int VAO, unsigned int VBO, unsigned int EBO)
      : VAO(VAO), VBO(VBO), EBO(EBO){};
  unsigned int VAO, VBO, EBO;
};

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

} // namespace Kepler

#endif
