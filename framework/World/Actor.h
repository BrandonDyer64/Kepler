
#ifndef Actor_h
#define Actor_h

#include "../Math/Vectors/Quaternion.h"
#include "../Math/Vectors/Vec3.h"
#include <vector>

namespace Kepler {

class Actor {
public:
  Vec3 location;
  Vec3 velocity;
  std::vector<Actor> actors;

public:
  Actor(Vec3 location) : location(location){};
  Actor(Vec3 location, Vec3 velocity){};
  Actor &AddActor(Actor &child);
  Vec3 DefineGravity(Vec3 pollLocation);
};
} // namespace Kepler

#endif
