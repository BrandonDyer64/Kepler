
// For reference view:
// https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/math/Quaternion.java

#ifndef Quaternion_h
#define Quaternion_h

#include "Vec3.h"

namespace Kepler {

class Quaternion {
public:
  const float x, y, z, w;
public:
  Quaternion(): x(0), y(0), z(0), w(0) {}
  Quaternion(float x, float y, float z, float w): x(0), y(0), z(0), w(0) {}
  Quaternion(Quaternion& other): x(other.x), y(other.y), z(other.z), w(other.w) {}
  Quaternion(Vec3& axis, float angle): x(axis.x), y(axis.y), z(axis.z), w(angle) {}
  float Magnitude();
public:
  static Quaternion FromEuler(float yaw, float pitch, float roll);
};

}

#endif
