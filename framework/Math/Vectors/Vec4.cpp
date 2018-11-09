#include <cmath>
#include "Vec4.h"

namespace Kepler {

Vec4 Vec4::operator+(const Vec4& other) const {
  return Vec4(x + other.x, y + other.y, z + other.z, w + other.w);
}

Vec4 Vec4::operator-(const Vec4& other) const {
  return Vec4(x - other.x, y - other.y, z - other.z, w - other.w);
}

Vec4 Vec4::operator*(const Vec4& other) const {
  return Vec4(x * other.x, y * other.y, z * other.z, w * other.w);
}

Vec4 Vec4::operator*(const float& other) const {
  return Vec4(x * other, y * other, z * other, w * other);
}

Vec4 Vec4::operator/(const Vec4& other) const {
  return Vec4(x / other.x, y / other.y, z / other.z, w / other.w);
}

Vec4 Vec4::operator/(const float& other) const {
  return Vec4(x / other, y / other, z / other, w / other);
}

float Vec4::Dot(const Vec4& other) const {
  return (x * other.x) + (y * other.y) + (z * other.z) + (w * other.w);
}

float Vec4::DistanceTo(const Vec4& other) const {
  Vec4 diff = *this - other;
  return std::sqrt(diff.Dot(diff));
}

float Vec4::Magnitude() const {
  return this->DistanceTo(Vec4());
}

Vec4 Vec4::Normalize() const {
  float m = this->Magnitude();
  if (m != 0) {
    return *this / m;
  } else {
    return Vec4(1,0,0,0);
  }
}

}
