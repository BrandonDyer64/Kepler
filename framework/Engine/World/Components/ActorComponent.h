#ifndef ActorComponent_h
#define ActorComponent_h

#include "Engine/Artemis.h"
#include "../Actor.h"

namespace Kepler {

class ActorComponent : public Component {
public:
  Actor actor;
  ActorComponent(Actor actor) {
    this->actor = actor;
  }
};

}

#endif
