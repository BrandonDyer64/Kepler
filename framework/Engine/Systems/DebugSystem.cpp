#include "DebugSystem.h"

namespace Kepler {

void DebugSystem::processEntities(ImmutableBag<Entity *> &bag) {
  time += world->GetDelta();
  if (time > 1.0f / ticksPerSecond) {
    time -= 1.0f / ticksPerSecond;
    std::cout << "Entities: " << bag.getCount() << std::endl;
  }
}

} // namespace Kepler
