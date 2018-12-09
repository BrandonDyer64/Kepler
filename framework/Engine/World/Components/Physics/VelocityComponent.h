#ifndef VelocityComponent_h
#define VelocityComponent_h

#include "Engine/Artemis.h"
#include "Math/Vectors/Vec3.h"

namespace Kepler {

class VelocityComponent : public Component {
public:
  Vec3 velocity;
  VelocityComponent(Vec3 velocity) : velocity(velocity){};
};

} // namespace Kepler

#endif
