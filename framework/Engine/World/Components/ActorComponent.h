#ifndef ActorComponent_h
#define ActorComponent_h

#include "../Actor.h"
#include "Engine/Artemis.h"

namespace Kepler {

class ActorComponent : public Component {
public:
  Actor *actor;
  ActorComponent(Actor *actor) { this->actor = actor; }
};

} // namespace Kepler

#endif
