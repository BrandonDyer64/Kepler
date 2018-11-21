#include "Poly3d.h"

namespace Kepler {

Poly3d Poly3d::Translate(const Vec3& x) const {
  return Poly3d(a + x, b + x, c + x);
}

}
