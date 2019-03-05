#ifndef TestActor_h
#define TestActor_h

#include <Engine/World/Actor.h>

class TestActor : Actor {
public:
  TestActor() : Actor("TestActor"){};
  virtual void Create(Entity &entity) {
    std::cout << "CREATED TEST ACTOR ######";
  }
  virtual void Tick(Entity &entity, float delta) {
    std::cout << "TICKED TEST ACTOR ######";
  }
}

#endif
