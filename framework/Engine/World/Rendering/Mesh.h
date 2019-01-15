#ifndef Mesh_h
#define Mesh_h

#include "Texture.h"
#include "Vertex.h"
#include <vector>

namespace Kepler {

class Game;
class Window;

class Mesh {
public:
  Game *game;
  std::vector<Vertex> vertices;
  std::vector<unsigned int> indices;
  std::vector<Texture> textures;
  void *apiMesh;

  Mesh(Game *g, std::vector<Vertex> v, std::vector<unsigned int> i,
       std::vector<Texture> t);

private:
  void SetupMesh(Game *game);
};

} // namespace Kepler

#endif
