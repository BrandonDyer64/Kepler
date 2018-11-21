#include "Quad3d.h"
#include "Poly3d.h"

namespace Kepler {

Poly3d* Quad3d::GetPolys() {
  return new Poly3d[2]{ Poly3d(a, b, c), Poly3d(c, d, a) };
}

}
