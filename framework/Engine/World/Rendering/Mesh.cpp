#include "../../Game.h"
#include "Mesh.h"

namespace Kepler {

Mesh::Mesh(std::vector<Vertex> v, std::vector<unsigned int> i,
           std::vector<Texture> t)
    : vertices(v), indices(i), textures(t) {}

void Mesh::SetupMesh(Game *game) { game->GetWindow()->SetupMesh(this); }

} // namespace Kepler
