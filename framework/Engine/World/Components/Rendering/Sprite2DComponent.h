#ifndef Sprite2DComponent_h
#define Sprite2DComponent_h

#include <Engine/Artemis.h>

namespace Kepler {

class Sprite2DComponent : public Component {
public:
  std::string textureName;
  Sprite2DComponent(std::string textureName) : textureName(textureName){};
};

} // namespace Kepler

#endif
