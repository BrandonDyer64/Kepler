#if defined(LIB_KEPLER) && defined(__has_include)

// Bullet 3
#if __has_include("bullet3/src/btBulletDynamicsCommon.h")
  #include "bullet3/src/btBulletDynamicsCommon.h"
  #include "bullet3/src/btBulletCollisionCommon.h"
#endif

// Box2D
#if __has_include("Box2D/Box2D/Box2D.h")
  #include "Box2D/Box2D/Box2D.h"
#endif

#endif
