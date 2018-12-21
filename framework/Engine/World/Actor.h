#ifndef Actor_h
#define Actor_h

#include "../Artemis.h"

namespace Kepler {

class Actor {
public:
  Actor();
  virtual void Create(Entity &entity);
  virtual void Tick(Entity &entity, float delta);
};

} // namespace Kepler

#endif
