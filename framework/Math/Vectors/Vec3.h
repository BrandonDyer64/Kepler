
#ifndef Vec3_h
#define Vec3_h

#include "Vec2.h"

namespace Kepler {

class Mat4;

class Vec3 {
public:
  union {
    // General Notation
    struct {
      const float x, y, z;
    };
    // Color Notation
    struct {
      const float r, g, b;
    };
    // HSL Color Notation
    struct {
      const float h, s, v;
    };
    // Vector Notation
    struct {
      const float i, j, k;
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
  Vec3 operator+=(const Vec3 &other) const;
  Vec3 operator-=(const Vec3 &other) const;
  bool operator==(const Vec3 &other) const;
  float Dot(const Vec3 &other) const;
  Vec3 Cross(const Vec3 &other) const;
  float DistanceTo(const Vec3 &other) const;
  float Magnitude() const;
  Vec3 Normalize() const;
};
} // namespace Kepler

#endif
