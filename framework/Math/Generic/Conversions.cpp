#include "Conversions.h"
#include <cmath>

namespace Kepler {

template<typename T>
T ToRadians(T degrees) {
  return degrees * (3.141592653589793238463 / 180.0);
}

float ToRadians(float degrees) {
  return ToRadians<float>(degrees);
}

template <typename T>
T ToDegrees(T radians) {
  return radians * (180.0 / 3.141592653589793238463);
}

float ToDegrees(float radians) {
  return ToDegrees<float>(radians);
}

}
