#ifndef Level_h
#define Level_h

#include "../Actor.h"
#include <string>

namespace Kepler {
class Level : public Actor {
public:
  std::string name;
  Level(std::string name) : name(name){};
};
} // namespace Kepler

#endif
