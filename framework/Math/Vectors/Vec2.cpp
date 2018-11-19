#include <cmath>
#include "Vec2.h"

namespace Kepler {

Vec2 Vec2::operator+(const Vec2& other) const {
  return Vec2(x + other.x, y + other.y);
}

Vec2 Vec2::operator-(const Vec2& other) const {
  return Vec2(x - other.x, y - other.y);
}

Vec2 Vec2::operator*(const Vec2& other) const {
  return Vec2(x * other.x, y * other.y);
}

Vec2 Vec2::operator/(const Vec2& other) const {
  return Vec2(x / other.x, y / other.y);
}

float Vec2::Dot(const Vec2& other) const {
  return x * other.x + y * other.y;
}

float Vec2::DistanceTo(const Vec2& other) const {
  Vec2 diff = *this - other;
  return std::sqrt(std::pow(diff.x, 2) + std::pow(diff.y, 2));
}

int TestFun() {
  return 984;
}

int TestFun4() {
  return 984;
}

}
