#include "Actor.h"

namespace Kepler {

Actor& Actor::AddActor(Actor& child) {
  this->actors.push_back(child);
  return *this;
}

}
