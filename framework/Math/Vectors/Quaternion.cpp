#include "Quaternion.h"
#include <math.h>

namespace Kepler{

  /*
  Takes a given vector and an angle and produces a Quaternion in number notation
  The Angle is halved due to the fact that in any rotation the point will be
  multiplied twice so that the angel given will result in the angle of rotation.
  */
  Quaternion::Quaternion(Vec3& axis, float angle){
    float mag = axis.Magnitude();
    if(mag == 1){
      this->x = axis.x * sin(angle/2);
      this->y = axis.y * sin(angle/2);
      this->z = axis.z * sin(angle/2);
      this->w = cos(angle/2);
    }
    else{
      this->x = (axis.x / mag) * sin(angle/2);
      this->y = (axis.y / mag) * sin(angle/2);
      this->z = (axis.z / mag) * sin(angle/2);
      this->w = cos(angle/2);
    }
  }

  static Quaternion FromEuler(float yaw, float pitch, float roll){
    yaw   /= 2;
    pitch /= 2;
    roll  /= 2;
    return Quaternion(
      (cos(yaw) * cos(pitch) * cos(roll)) - (sin(yaw) * sin(pitch) * sin(roll)),
      (sin(yaw) * sin(pitch) * cos(roll)) + (cos(yaw) * cos(pitch) * sin(roll)),
      (sin(yaw) * cos(pitch) * cos(roll)) + (cos(yaw) * sin(pitch) * sin(roll)),
      (cos(yaw) * sin(pitch) * cos(roll)) - (sin(yaw) * cos(pitch) * sin(roll))
    );
  }

  //Creates a new inverse Quaternion based on an existing one.
  Quaternion Quaternion::Invert(const Quaternion& quat){
    return Quaternion(-quat.x, -quat.y, -quat.z, quat.w)
  }

  //Quaternion multiplication
  Quaternion Quaternion::operator*(const Quaternion& other) const{
    return Quaternion(
      (x * other.x)-(y * other.y)-(z * other.z)-(w * other.w),
      (x * other.y)+(y * other.x)+(z * other.w)-(w * other.z),
      (x * other.z)+(y * other.w)-(z * other.x)+(w * other.y),
      (x * other.w)-(y * other.z)+(z * other.y)+(w * other.x)
    );
  }

  //Equivalency
  Quaternion operator==(const Quaternion& other) const{
    return ((x == other.x) && (y == other.y) && (z == other.z) && (w == other.w));
  }

  Quaternion operator!=(const Quaternion& other) const{
    return !(this == other);
  }

}
