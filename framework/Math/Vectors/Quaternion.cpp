#include "Quaternion.h"
#include <math.h>
#include <cmath>
#include <iostream>

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

// Note: Do not use this function unless you are sure the points given will be
// a proper quaternion in number notation.
Quaternion Quaternion::FromFloats(float x, float y, float z, float w){
  if(1 == std::pow(x,2) + std::pow(y,2) + std::pow(z,2), std::pow(w,2))
  return  Quaternion(x, y, z, w);
  {
    //TODO: SetDebug Flag for printing
    std::cout << ("Quaternion Function FromPoints Has normalized a quaternion. Check usage.") << std::endl;
    float mag = sqrt(std::pow(x,2) + std::pow(y,2) + std::pow(z,2)
                      + std::pow(w,2));
    Quaternion(x / mag, y / mag, z / mag, w / mag);
  }
}

Quaternion Quaternion::FromLookAxis(Vec3 &up, Vec3 &forward)
{
  Vec3 normforward = forward.Normalize();
  Vec3 normright = up.Cross(normforward).Normalize();
  Vec3 normup = normforward.Cross(normright);

  float r = normright.x + normup.y + normforward.z;
  if(r > 0.0){
    float w = sqrt(r + 1.0);
    float qw = w * 0.5;
    float r1 = 0.5 / w;
    float qx = (normup.z - normforward.y) * r1;
    float qy = (normforward.x - normright.z) * r1;
    float qz = (normright.y - normup.x) * r1;
    return FromFloats(qx, qy, qz, qw);
  }
  if(normright.x >= normup.y && normright.x >= normforward.z){
    float r1 = sqrt(1.0 + normright.x - normup.y - normforward.z);
    float r2 = 0.5 / r1;
    float qx = 0.5 * r1;
    float qy = (normright.y + normup.x) * r2;
    float qz = (normright.z + normforward.x) * r2;
    float qw = (normup.z + normforward.y) * r2;
    return FromFloats(qx, qy, qz, qw);
  }
  if(normup.y > normforward.z){
    float r1 = sqrt(1.0 + normup.y - normright.x - normforward.z);
    float r2 = 0.5 / r1;
    float qx = (normup.x + normright.y) * r2;
    float qy = 0.5 * r1;
    float qz = (normforward.y + normup.z) * r2;
    float qw = (normforward.x + normright.z) * r2;
    return FromFloats(qx, qy, qz, qw);
  }
  {
    float r1 = sqrt(1.0 + normforward.z - normright.x - normup.y);
    float r2 = 0.5 / r1;
    float qx = (normforward.x + normright.z) * r2;
    float qy = (normforward.y + normup.z) * r2;
    float qz = 0.5 * r1;
    float qw = (normright.y + normup.x) * r2;
    return FromFloats(qx, qy, qz, qw);
  }
}



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
