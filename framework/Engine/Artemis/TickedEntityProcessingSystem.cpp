#include "TickedEntityProcessingSystem.h"

namespace Kepler {

void TickedEntityProcessingSystem::processEntities(
    ImmutableBag<Entity *> &bag) {
  time += world->GetDelta();
  if (time > 1.0f / ticksPerSecond) {
    time -= 1.0f / ticksPerSecond;
    EntityProcessingSystem::processEntities(bag);
  }
}

} // namespace Kepler
