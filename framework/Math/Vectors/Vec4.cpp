#include <cmath>
#include "Vec4.h"

Vec4 Vec4::operator+(const Vec4& other) const {
  return Vec4(x + other.x, y + other.y, z + other.z, w + other.w);
}

Vec4 Vec4::operator-(const Vec4& other) const {
  return Vec4(x - other.x, y - other.y, z - other.z, w - other.w);
}

Vec4 Vec4::operator*(const Vec4& other) const {
  return Vec4(x * other.x, y * other.y, z * other.z, w * other.w);
}

Vec4 Vec4::operator/(const Vec4& other) const {
  return Vec4(x / other.x, y / other.y, z / other.z, w / other.w);
}

float Vec4::Dot(const Vec4& other) const {
  return (x * other.x) + (y * other.y) + (z * other.z) + (w * other.w);
}

float Vec4::DistanceTo(const Vec4& other) const {
  Vec4 diff = *this - other;
  return std::sqrt(diff.Dot(diff));
}
