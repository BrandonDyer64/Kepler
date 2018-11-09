
#ifndef Vec4_h
#define Vec4_h

#include "Vec2.h"
#include "Vec3.h"

namespace Kepler {

class Vec4 {
public:
  const float x;
  const float y;
  const float z;
  const float w;
public:
  Vec4(): x(0), y(0), z(0), w(0) {}
  Vec4(float x, float y, float z, float w): x(x), y(y), z(z), w(w) {};
  Vec4(const Vec2& vec2, float z, float w): x(vec2.x), y(vec2.y), z(z), w(w) {};
  Vec4(const Vec2& vec2, const Vec2& vec22): x(vec2.x), y(vec2.y), z(vec22.x), w(vec22.y) {};
  Vec4(const Vec3& vec3, float w): x(vec3.x), y(vec3.y), z(vec3.z), w(w) {}
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
