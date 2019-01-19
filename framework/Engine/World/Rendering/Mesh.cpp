#include "../../Game.h"
#include "Mesh.h"

namespace Kepler {

Mesh::Mesh(Game *g, std::vector<Vertex> v, std::vector<unsigned int> i,
           std::vector<Texture> t)
    : game(g), vertices(v), indices(i), textures(t) {
  SetupMesh(game);
}

void Mesh::SetupMesh(Game *game) { game->GetWindow()->SetupMesh(this); }

} // namespace Kepler
