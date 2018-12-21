#include "Engine/Artemis.h"
#include "Engine/World/Components/Physics/PositionComponent.h"
#include "Engine/World/Level.h"
#include "Math/Vectors/Vec3.h"

class MyLevel : public Kepler::Level {
public:
  MyLevel(Kepler::EntityManager *em) : Level(em) {
    Kepler::Entity &entity = em->create();
    entity.AddComponent(new Kepler::PositionComponent(Kepler::Vec3()));
    entity.Refresh();
  }
};
