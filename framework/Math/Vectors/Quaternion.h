
// For reference view:
// https://eater.net/quaternions
// https://en.wikipedia.org/wiki/Quaternion#Unit_quaternion
// https://en.wikipedia.org/wiki/Quaternions_and_spatial_rotation

#ifndef Quaternion_h
#define Quaternion_h


#include "Vec3.h"

namespace Kepler {

class Quaternion {
public:
  union {
    // Number Notation
    struct {
      const float x, y, z, w;
    };
    // Angle Notation
    struct {
      const float i, j, k, a;
    };
    // Vector Notation
    struct {
      const float d_i, d_j, d_k, r;
    };
  };

public:
  // Quaternions can not be inialized with a 0 in w (a) because it is always a
  // unit vector.
  Quaternion() : x(0), y(0), z(0), w(1) {}

  Quaternion(float x, float y, float z, float w) : x(x), y(y), z(z), w(w) {}

  Quaternion(Quaternion &other)
      : x(other.x), y(other.y), z(other.z), w(other.w) {}
protected:
  Quaternion(Vec3 &axis, float angle);
public:
  static Quaternion FromAxis( Vec3& axis, float angle);
  static Quaternion FromEuler(float yaw, float pitch, float roll);
  Quaternion Invert(const Quaternion &quat);

  Quaternion LocalYaw(float angle);
  Quaternion LocalPitch(float angle);
  Quaternion LocalRoll(float angle);
  Quaternion LocalRotate(float yaw, float pitch, float roll);

  Quaternion Yaw(Vec3 normal, float angle);
  Quaternion Pitch(Vec3 normal, float angle);
  Quaternion Roll(Vec3 normal, float angle);
  Quaternion Rotate(Vec3 normal, float yaw, float pitch, float roll);

  Quaternion &operator*(const Quaternion &other) const;
  bool operator==(const Quaternion &other) const;
  bool operator!=(const Quaternion &other) const;
};

} // namespace Kepler

#endif
