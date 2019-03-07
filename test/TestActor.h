#ifndef TestActor_h
#define TestActor_h

#include <Engine/World/Actor.h>
#include <Engine/World/Components/Physics/PositionComponent.h>
#include <Math/Vectors/Vec3.h>

class TestActor : public Kepler::Actor {
public:
  TestActor() : Actor("TestActor"){};

  virtual void Create(Kepler::Entity &entity, void *settings) {
    using namespace Kepler;
    Vec3 *pos = (Vec3 *)settings;
    entity.AddComponent(new PositionComponent(*pos));
    std::cout << "CREATED TEST ACTOR ######" << std::endl;
  }

  virtual void Tick(Kepler::Entity &entity, float delta) {
    using namespace Kepler;
    PositionComponent *pos = (PositionComponent *)entity.GetComponent<PositionComponent>();
    pos->position += Vec3(delta, 0, 0);
    std::cout << "POS: " << pos->position << std::endl;
  }
};

#endif
