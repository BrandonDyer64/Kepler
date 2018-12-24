
#if defined(LIB_KEPLER) && defined(__has_include)

#pragma message ("Third Party")

// libRocket
#if __has_include("libRocket/Include/Rocket/Core.h")
  #pragma message ("libRocket")
  #include "libRocket/Include/Rocket/Core.h"
  #include "libRocket/Include/Rocket/Controls.h"
  #include "libRocket/Include/Rocket/Debugger.h"
#endif

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
