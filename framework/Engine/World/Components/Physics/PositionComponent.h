#ifndef PositionComponent_h
#define PositionComponent_h

#include "../../../../Math/Vectors/Vec3.h"
#include "../../../Artemis.h"

namespace Kepler {

class PositionComponent : public Component {
public:
  Vec3 position;
  PositionComponent(Vec3 position) : position(position){};
};

} // namespace Kepler

#endif
