
#ifndef Quaternion_h
#define Quaternion_h

#include "Vec4.h"

namespace Kepler {

class Quaternion {
public:
  const Vec4 q;
public:
  Quaternion(): q(Vec4(0,0,0,1)) {}
  Quaternion(float w, float x, float y, float z): q(Vec4(x, y, z, w)) {};
  Quaternion(Vec4 vector): q(vector) {};
  Vec4 operator+(const Vec4& other) const;
  Vec4 operator-(const Vec4& other) const;
  Vec4 operator*(const Vec4& other) const;
  Vec4 operator*(const float& other) const;
  Vec4 operator/(const Vec4& other) const;
  Vec4 operator/(const float& other) const;
  float Dot(const Vec4& other) const;
  float DistanceTo(const Vec4& other) const;
  float Magnitude() const;
  Vec4 Normalize() const;
};

}

#endif
