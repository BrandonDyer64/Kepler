
#ifndef Actor_h
#define Actor_h

#include <vector>
#include "../Math/Vectors/Vec3.h"
#include "../Math/Vectors/Quaternion.h"

namespace Kepler {

  class Actor {
  public:
    Vec3 location;
    std::vector<Actor> actors;
  public:
    Actor& AddActor(Actor& child);
  };
}

#endif
