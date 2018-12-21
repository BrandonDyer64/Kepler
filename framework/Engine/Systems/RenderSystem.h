#include "../Artemis.h"
#include "../Rendering/RenderAPI.h"
#include "../World/Components/Physics/PositionComponent.h"
#include "../World/Components/Physics/RotationComponent.h"
#include "../World/Components/Rendering/MeshComponent.h"

namespace Kepler {

class RenderSystem : public EntityProcessingSystem {
private:
  RenderAPI *api;
  ComponentMapper<MeshComponent> meshMapper;
  ComponentMapper<PositionComponent> positionMapper;
  ComponentMapper<RotationComponent> rotationMapper;

public:
  RenderSystem(RenderAPI *api) : api(api) { AddComponentType<MeshComponent>(); }
  virtual void initialize() { meshMapper.init(*world); }
  virtual void processEntity(Entity &e) {
    // Mesh *mesh = meshMapper.get(e)->mesh;
    // TODO: Implementation
  }
};

} // namespace Kepler
