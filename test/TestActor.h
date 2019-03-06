#ifndef TestActor_h
#define TestActor_h

#include <Engine/World/Actor.h>

class TestActor : public Kepler::Actor {
public:
  TestActor() : Actor("TestActor"){};
  virtual void Create(Kepler::Entity &entity) {
    std::cout << "CREATED TEST ACTOR ######";
  }
  virtual void Tick(Kepler::Entity &entity, float delta) {
    std::cout << "TICKED TEST ACTOR ######";
  }
};

#endif
