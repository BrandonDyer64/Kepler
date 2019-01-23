#include "Quaternion.h"
#include <math.h>

namespace Kepler {

/*
Takes a unit vector and an angle and produces a Quaternion in number notation.
The Angle is halved due to the fact that in any rotation the point will be
multiplied twice so that the angel given will result in the angle of rotation.
*/
Quaternion::Quaternion(Vec3 &axis, float angle)
    : x(axis.x * sin(angle / 2)), // X
      y(axis.y * sin(angle / 2)), // Y
      z(axis.z * sin(angle / 2)), // Z
      w(cos(angle / 2))           // W
{}

// Creates a Quaternion from two axis returning a quaternion mimic the rotatation from
// the first axis to the second axis.
Quaternion Quaternion::FromVectors(Vec3& u, Vec3& v){
    Vec3 un = u.Normalize();
    Vec3 vn = v.Normalize();
    float m = sqrt(un.Dot(vn) * 2.0 + 2.0);
    Vec3 w = un.Cross(vn) * (1.0 / m);
    return Quaternion(0.5 * m, w.x, w.y, w.z);
}

// Creates a Quaternion given a rotational axis and an angle about that axis.
Quaternion Quaternion::FromAxis(Vec3& axis, float angle){
  Vec3 normAxis = axis.Normalize();
  return Quaternion(normAxis, angle);
}

// Creates a Quaternion based on the given Euler Angles
Quaternion Quaternion::FromEuler(float yaw, float pitch, float roll) {
  yaw /= 2;
  pitch /= 2;
  roll /= 2;
  return Quaternion(
    cos(yaw) * cos(pitch) * cos(roll) - (sin(yaw) * sin(pitch) * sin(roll)),
    sin(yaw) * sin(pitch) * cos(roll) + (cos(yaw) * cos(pitch) * sin(roll)),
    sin(yaw) * cos(pitch) * cos(roll) + (cos(yaw) * sin(pitch) * sin(roll)),
    cos(yaw) * sin(pitch) * cos(roll) - (sin(yaw) * cos(pitch) * sin(roll))
  );
}

/*
Quaternion FromLookAxis(Vec3 &up, Vec3 &forward)
{
  Vec3 normforward = forward.Normalize();
  Vec3 normright = up.Cross(normforward).Normalize();
  Vec3 normup = normforward.Cross(normright);

  float r = normright.x + normup.y + normforward.z;
  Quaternion result();
  if(r > 0.0){
    float w = std::sqrt(r + 1.0);
    result.w = w * 0.5;
    r1 = 0.5 / w
    result.x = (normup.z - normforward.y) * r1;
    result.y = (normforward.x - normright.z) * r1;
    result.z = (normright.y - normup.x) * r1;
    return result
  }
  if(normright.x >= normup.y && normright.x >= normforward.z){
    float r1 = std::sqrt(1.0 + normright.x - normup.y - normforward.z);
    float r2 = 0.5 / r1;
    result.x = 0.5 * r1;
    result.y = (normright.y + normup.x) * r2;
    result.z = (normright.z + normforward.x) * r2;
    result.w = (normup.z + normforward.y) * r2;
    return result;
  }
  if(normup.y > normforward.z){
    float r1 = std::sqrt(1.0 + normup.y - normright.x - normforward.z);
    float r2 = 0.5 / r1;
    result.x = (normup.x + normright.y) * r2;
    result.y = 0.5 * r1;
    result.z = (normforward.y + normup.z) * r2;
    result.w = (normforward.x + normright.z) * r2;
    return result;
  }
  {
    float r1 = std::sqrt(1.0 + normforward.z - normright.x - normup.y);
    float r2 = 0.5 / r1;
    result.x = (normforward.x + normright.z) * r2;
    result.y = (normforward.y + normup.z) * r2;
    result.z = 0.5 * r1;
    result.w = (normright.y + normup.x) * r2;
    return result;
  }
}
*/

// Creates a new inverse Quaternion based on an existing one.
Quaternion Quaternion::Invert(const Quaternion &quat) {
  return Quaternion(-quat.x, -quat.y, -quat.z, quat.w);
}

// Quaternion multiplication
// Note Quaternions are not commutative (quat x; quat y;  x*y != y*x)
Quaternion Quaternion::operator*(const Quaternion &other) const {
  return Quaternion(
      (x * other.x) - (y * other.y) - (z * other.z) - (w * other.w),
      (x * other.y) + (y * other.x) + (z * other.w) - (w * other.z),
      (x * other.z) + (y * other.w) - (z * other.x) + (w * other.y),
      (x * other.w) - (y * other.z) + (z * other.y) + (w * other.x));
}

// Equivalency
bool Quaternion::operator==(const Quaternion &other) const {
  return ((x == other.x) && (y == other.y) && (z == other.z) && (w == other.w));
}

bool Quaternion::operator!=(const Quaternion &other) const {
  return !(*this == other);
}

} // namespace Kepler
