
#include "Quaternion.h"
#include "../Matrices/Mat4.h"

// Local rotations (Rotataion using a local up)
namespace Kepler{

Vec3 Quaternion::GetUp(const Quaternion &quat){
  Vec3 up(0,0,1);
  Mat4 rot = Mat4::Rotate(quat);
  return up * rot;
}
Vec3 Quaternion::GetForward(const Quaternion &quat){
  Vec3 forward(0,1,0);
  Mat4 rot = Mat4::Rotate(quat);
  return forward * rot;
}
Vec3 Quaternion::GetRight(const Quaternion &quat){
  Vec3 right(1,0,0);
  Mat4 rot = Mat4::Rotate(quat);
  return right * rot;
}

Quaternion Quaternion::LocalYaw(float angle) {
  return LocalRotate(angle, 0, 0);
}

Quaternion Quaternion::LocalPitch(float angle) {
  return LocalRotate(0, angle, 0);
}

Quaternion Quaternion::LocalRoll(float angle) {
  return LocalRotate(0, 0, angle);
}

Quaternion Quaternion::LocalRotate(float yaw, float pitch, float roll) {
  return *this * FromEuler(yaw, pitch, roll);
}

// Normal rotations (Rotation using a global up)
Quaternion Quaternion::Yaw(Vec3 &normal, float angle) {
  return *this * FromAxis(normal, angle);
}



}//namespace Kepler
