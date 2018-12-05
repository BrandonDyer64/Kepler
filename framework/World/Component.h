#ifndef Component_h
#define Component_h

#include "../Math/Vectors/Quaternion.h"
#include "../Math/Vectors/Vec3.h"

namespace Kepler {
class Component {
public:
  Vec3 location;
  Quaternion rotation;
  Component(){};
  Component(Vec3 location) : location(location){};
};
} // namespace Kepler

#endif
