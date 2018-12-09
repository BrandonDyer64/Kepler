#ifndef PositionComponent_h
#define PositionComponent_h

#include "Engine/Artemis.h"
#include "Math/Vectors/Vec3.h"

namespace Kepler {

class PositionComponent : public Component {
public:
  Vec3 velocity;
  PositionComponent(Vec3 velocity) : velocity(velocity){};
};

} // namespace Kepler

#endif
