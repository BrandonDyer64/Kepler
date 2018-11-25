
#ifndef Poly3d_h
#define Poly3d_h

#include "../Vectors/Vec3.h"

namespace Kepler {

class Poly3d {
public:
  const Vec3 a, b, c;
public:
  Poly3d(): a(Vec3()), b(Vec3()), c(Vec3()) {};
  Poly3d(Vec3 a, Vec3 b, Vec3 c): a(a), b(b), c(c) {};
  Poly3d Translate(const Vec3& x) const;
};
}

#endif
