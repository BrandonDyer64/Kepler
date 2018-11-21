
#ifndef Quad3d_h
#define Quad3d_h

#include "../Vectors/Vec3.h"
#include "Poly3d.h"

namespace Kepler {

class Quad3d {
public:
  const Vec3 a, b, c, d;
public:
  Quad3d(): a(Vec3()), b(Vec3()), c(Vec3()), d(Vec3()) {};
  Quad3d(Vec3 a, Vec3 b, Vec3 c, Vec3 d): a(a), b(b), c(c), d(d) {};
  Poly3d* GetPolys();
};
}

#endif
