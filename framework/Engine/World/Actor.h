#ifndef Actor_h
#define Actor_h

#include "../Artemis.h"

namespace Kepler {

class Actor {
public:
  const std::string name;

public:
  Actor(std::string name) : name(name){};
  virtual void Create(Entity &entity, void *settings);
  virtual void Tick(Entity &entity, float delta);
};

} // namespace Kepler

#endif
