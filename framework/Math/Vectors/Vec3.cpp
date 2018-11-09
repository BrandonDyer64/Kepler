#include <cmath>
#include "Vec3.h"

namespace Kepler {

Vec3 Vec3::operator+(const Vec3& other) const {
  return Vec3(x + other.x, y + other.y, z + other.z);
}

Vec3 Vec3::operator-(const Vec3& other) const {
  return Vec3(x - other.x, y - other.y, z - other.z);
}

Vec3 Vec3::operator*(const Vec3& other) const {
  return Vec3(x * other.x, y * other.y, z * other.z);
}

Vec3 Vec3::operator*(const float& other) const {
  return Vec3(x * other, y * other, z * other);
}

Vec3 Vec3::operator/(const Vec3& other) const {
  return Vec3(x / other.x, y / other.y, z / other.z);
}

Vec3 Vec3::operator/(const float& other) const {
  return Vec3(x / other, y / other, z / other);
}

Vec3 Vec3::operator+=(const Vec3& other) const {
  return *this + other;
}

Vec3 Vec3::operator-=(const Vec3& other) const {
  return *this - other;
}

float Vec3::Dot(const Vec3& other) const {
  return (x * other.x) + (y * other.y) + (z * other.z);
}

float Vec3::DistanceTo(const Vec3& other) const {
  Vec3 diff = *this - other;
  return std::sqrt(diff.Dot(diff));
}

float Vec3::Magnitude() const {
  return this->DistanceTo(Vec3());
}

Vec3 Vec3::Normalize() const {
  float m = this->Magnitude();
  if (m != 0) {
    return *this / m;
  } else {
    return *this;
  }
}

}
