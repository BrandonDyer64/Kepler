
#if defined(LIB_KEPLER) && defined(__has_include)

#pragma message ("Third Party")

// zlib - Asset compression
#if __has_include("zlib/zlib.h")
  #define USING_ZLIB
  #include "zlib/zlib.h"
#endif

// libRocket - User Interface with HTML and CSS
#if __has_include("libRocket/Include/Rocket/Core.h")
  #define USING_LIBROCKET
  #include "libRocket/Include/Rocket/Core.h"
  #include "libRocket/Include/Rocket/Controls.h"
  #include "libRocket/Include/Rocket/Debugger.h"
#endif

// Bullet 3 - 3D Physics
#if __has_include("bullet3/src/btBulletDynamicsCommon.h")
  #define USING_BULLET3
  #include "bullet3/src/btBulletDynamicsCommon.h"
  #include "bullet3/src/btBulletCollisionCommon.h"
#endif

// Box2D - 2D Physics
#if __has_include("Box2D/Box2D/Box2D.h")
  #define USING_BOX2D
  #include "Box2D/Box2D/Box2D.h"
#endif

#endif
