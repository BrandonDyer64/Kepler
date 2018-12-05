#ifndef MeshComponent_h
#define MeshComponent_h

#include "../../Rendering/Mesh.h"
#include "../Component.h"

namespace Kepler {
class MeshComponent : public Component {
public:
  Mesh *mesh;

public:
  MeshComponent(Mesh *mesh) : mesh(mesh){};
};
} // namespace Kepler

#endif
