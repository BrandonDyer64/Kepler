#ifndef ActorSystem_h
#define ActorSystem_h

#include "../Artemis.h"
#include "../World/Components/ActorComponent.h"

namespace Kepler {

class ActorSystem : public EntityProcessingSystem {
private:
  ComponentMapper<ActorComponent> actorMapper;

public:
  ActorSystem() { AddComponentType<ActorComponent>(); }
  virtual void initialize();
  virtual void processEntity(Entity &e);
};

} // namespace Kepler

#endif
