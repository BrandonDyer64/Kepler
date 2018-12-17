#ifndef RotationComponent_h
#define RotationComponent_h

#include "Engine/Artemis.h"
#include "Math/Vectors/Quaternion.h"

namespace Kepler {

class RotationComponent : public Component {
public:
  Quaternion rotation;
  RotationComponent(Quaternion rotation) : rotation(rotation){};
};

} // namespace Kepler

#endif
