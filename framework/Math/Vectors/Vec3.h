
#ifndef Vec3_h
#define Vec3_h

#include "Vec2.h"
#include <iostream>

namespace Kepler {

class Mat4;

class Vec3 {
public:
  union {
    // General Notation
    struct {
      float x, y, z;
    };
    // Color Notation
    struct {
      float r, g, b;
    };
    // HSL Color Notation
    struct {
      float h, s, v;
    };
    // Vector Notation
    struct {
      float i, j, k;
    };
  };

public:
  Vec3() : x(0), y(0), z(0){};
  Vec3(float x, float y, float z) : x(x), y(y), z(z){};
  Vec3 operator+(const Vec3 &other) const;
  Vec3 operator-(const Vec3 &other) const;
  Vec3 operator*(const Vec3 &other) const;
  Vec3 operator*(const float &other) const;
  Vec3 operator*(const Mat4 &other) const;
  Vec3 operator/(const Vec3 &other) const;
  Vec3 operator/(const float &other) const;
  Vec3 operator+=(const Vec3 &other);
  Vec3 operator-=(const Vec3 &other);
  bool operator==(const Vec3 &other) const;
  friend std::ostream &operator<<(std::ostream &out, const Vec3 &other);
  float Dot(const Vec3 &other) const;
  Vec3 Cross(const Vec3 &other) const;
  float DistanceTo(const Vec3 &other) const;
  float Magnitude() const;
  Vec3 Normalize() const;
};
} // namespace Kepler

#endif
