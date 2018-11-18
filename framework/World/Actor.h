
#ifndef Actor_h
#define Actor_h

#include "../Math/Vectors/Vec3.h"
#include "../Math/Vectors/Quaternion.h"

namespace Kepler {

  class Actor {
  public:
    Vec3 location;
    Quaternion rotation;
  };
}

#endif
