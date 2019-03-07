#include "ActorSystem.h"

namespace Kepler {

void ActorSystem::initialize() { std::cout << "Actor init" << std::endl;actorMapper.init(*world); }

void ActorSystem::processEntity(Entity &e) {
  Actor *actor = actorMapper.get(e)->actor;
  actor->Tick(e, world->GetDelta());
}

} // namespace Kepler
