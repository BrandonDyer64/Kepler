#ifndef MeshComponent_h
#define MeshComponent_h

#include "Engine/Artemis.h"
#include "Rendering/Mesh.h"

namespace Kepler {

class MeshComponent : public Component {
public:
  Mesh *mesh;
  MeshComponent(Mesh *mesh) : mesh(mesh){};
};

} // namespace Kepler

#endif
