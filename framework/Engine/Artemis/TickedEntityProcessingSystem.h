#ifndef TickedEntityProcessingSystem_h
#define TickedEntityProcessingSystem_h

#include "EntityProcessingSystem.h"
#include "EntitySystem.h"
#include "ImmutableBag.h"
#include "World.h"
#include <chrono>

namespace Kepler {

class TickedEntityProcessingSystem : public EntityProcessingSystem {
protected:
  float time;
  float ticksPerSecond;

public:
  TickedEntityProcessingSystem(float ticksPerSecond)
      : ticksPerSecond(ticksPerSecond){};
  virtual void processEntities(ImmutableBag<Entity *> &bag);
};

} // namespace Kepler

#endif
