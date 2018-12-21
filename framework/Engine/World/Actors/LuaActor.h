#ifndef LuaActor_h
#define LuaActor_h

#include "../Actor.h"

namespace Kepler {

class LuaActor : public Actor {
public:
  LuaActor(std::string &filename);
};

} // namespace Kepler

#endif
