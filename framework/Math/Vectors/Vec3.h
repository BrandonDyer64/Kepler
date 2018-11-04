
#ifndef Vec3_h
#define Vec3_h

#include "Vec2.h"

class Vec3 {
public:
  const float x;
  const float y;
  const float z;
public:
  Vec3(): x(0), y(0), z(0) {};
  Vec3(float x, float y, float z): x(x), y(y), z(z) {};
  Vec3(const Vec2& vec2, float z): x(vec2.x), y(vec2.y), z(z) {};
  Vec3(const Vec2& vec2): x(vec2.x), y(vec2.y), z(0) {};
  Vec3 operator+(const Vec3& other) const;
  Vec3 operator-(const Vec3& other) const;
  Vec3 operator*(const Vec3& other) const;
  Vec3 operator*(const float& other) const;
  Vec3 operator/(const Vec3& other) const;
  Vec3 operator/(const float& other) const;
  Vec3 operator+=(const Vec3& other) const;
  Vec3 operator-=(const Vec3& other) const;
  float Dot(const Vec3& other) const;
  float DistanceTo(const Vec3& other) const;
  float Magnitude() const;
  Vec3 Normalize() const;
};

#endif
