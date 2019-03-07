#ifndef DebugSystem_h
#define DebugSystem_h

#include "../Artemis.h"
#include "../World/Components/Physics/PositionComponent.h"

namespace Kepler {

class DebugSystem : public TickedEntityProcessingSystem {
private:
  ComponentMapper<PositionComponent> positionMapper;

public:
  DebugSystem() : TickedEntityProcessingSystem(0.5f) {
    AddComponentType<PositionComponent>();
  }
  virtual void initialize() { std::cout << "Debug init" << std::endl;positionMapper.init(*world); }
  virtual void processEntities(ImmutableBag<Entity *> &bag);
  virtual void processEntity(Entity &e) {}
};

} // namespace Kepler

#endif
