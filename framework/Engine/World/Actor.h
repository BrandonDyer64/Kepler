#ifndef Actor_h
#define Actor_h

#include "Engine/Artemis.h"

namespace Kepler {

class Actor {
public:
  const Entity *entity;

public:
  Actor(Entity &entity);
  virtual void Tick();
};

} // namespace Kepler

#endif
