
#ifndef Actor_h
#define Actor_h

#include "../Math/Vectors/Quaternion.h"
#include "../Math/Vectors/Vec3.h"
#include "Component.h"
#include <vector>

namespace Kepler {

class Actor {
public:
  Vec3 location;
  Vec3 velocity;
  Quaternion rotation;
  Quaternion angularVelocity;
  float mass;
  std::vector<Actor *> actors;
  std::vector<Component *> components;

public:
  Actor() {}
  Actor(Vec3 location) : location(location){};
  Actor(Vec3 location, Vec3 velocity)
      : location(location), velocity(velocity){};
  Actor &AddActor(Actor *child);
  Actor &AddComponent(Component *component);
};

} // namespace Kepler

#endif
