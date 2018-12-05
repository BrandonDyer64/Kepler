#ifndef Game_h
#define Game_h

#include "../World/Actors/Level.h"

namespace Kepler {

class Game {
public:
  float currentTime = 0;

private:
  Level level;

public:
  Game(Level level) : level(level){};
};

} // namespace Kepler

#endif
