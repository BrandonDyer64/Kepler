#ifndef AngelActor_h
#define AngelActor_h

#include "Actor.h"

namespace Kepler {

class AngelActor : Actor {
private:
  void *module;
  void *createFun;
  void *tickFun;
public:
  AngelActor(std::string name);
  virtual void Create(Entity &entity);
  virtual void Tick(Entity &entity, float delta);
};

}

#endif
