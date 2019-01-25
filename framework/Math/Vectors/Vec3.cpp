#include "Vec3.h"
#include <cmath>

namespace Kepler {

Vec3 Vec3::operator+(const Vec3 &other) const {
  return Vec3(x + other.x, y + other.y, z + other.z);
}

Vec3 Vec3::operator-(const Vec3 &other) const {
  return Vec3(x - other.x, y - other.y, z - other.z);
}

Vec3 Vec3::operator*(const Vec3 &other) const {
  return Vec3(x * other.x, y * other.y, z * other.z);
}

Vec3 Vec3::operator*(const float &other) const {
  return Vec3(x * other, y * other, z * other);
}

Vec3 Vec3::operator*(const Mat4 &other) const {
  return *this;
}

Vec3 Vec3::operator/(const Vec3 &other) const {
  return Vec3(x / other.x, y / other.y, z / other.z);
}

Vec3 Vec3::operator/(const float &other) const {
  return Vec3(x / other, y / other, z / other);
}

Vec3 Vec3::operator+=(const Vec3 &other) const { return *this + other; }

Vec3 Vec3::operator-=(const Vec3 &other) const { return *this - other; }

bool Vec3::operator==(const Vec3 &other) const {
  return x == other.x && y == other.y && z == other.z;
}

std::ostream &operator<<(std::ostream &out, const Vec3 &other){
  out << "Vec2( " << other.x << ", " << other.y << ", "<< other.z << ")"
    << std::endl;
  return out;
}

float Vec3::Dot(const Vec3 &other) const {
  return (x * other.x) + (y * other.y) + (z * other.z);
}

Vec3 Vec3::Cross(const Vec3 &other) const {
  return Vec3((y * other.z) - (z * other.y), (z * other.x) - (x * other.z),
              (x * other.y) - (y * other.x));
}

float Vec3::DistanceTo(const Vec3 &other) const {
  Vec3 diff = *this - other;
  return std::sqrt(diff.Dot(diff));
}

float Vec3::Magnitude() const { return this->DistanceTo(Vec3()); }

Vec3 Vec3::Normalize() const {
  float m = this->Magnitude();
  if (m == 1)
    return *this;
  if (m != 0)
    return *this / m;
  return Vec3(1, 0, 0);
}

} // namespace Kepler
