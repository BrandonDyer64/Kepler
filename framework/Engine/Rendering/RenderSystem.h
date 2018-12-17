#include "Engine/Artemis.h"
#include "Engine/World/Components/Physics/PositionComponent.h"
#include "Engine/World/Components/Physics/RotationComponent.h"
#include "Engine/World/Components/Rendering/MeshComponent.h"
#include "RenderAPI.h"

namespace Kepler {

class RenderSystem : public EntityProcessingSystem {
private:
  RenderAPI *api;
  ComponentMapper<MeshComponent> meshMapper;
  ComponentMapper<PositionComponent> positionMapper;
  ComponentMapper<RotationComponent> rotationMapper;

public:
  RenderSystem(RenderAPI *api) : api(api) { addComponentType<MeshComponent>(); }
  virtual void initialize() { meshMapper.init(*world); }
  virtual void processEntity(Entity &e) {
    // Mesh *mesh = meshMapper.get(e)->mesh;
    // TODO: Implementation
  }
};

} // namespace Kepler
