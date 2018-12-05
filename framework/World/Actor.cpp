#include "Actor.h"

namespace Kepler {

Actor &Actor::AddActor(Actor *child) {
  this->actors.push_back(child);
  return *this;
}

Actor &Actor::AddComponent(Component *component) {
  this->components.push_back(component);
  return *this;
}

} // namespace Kepler
