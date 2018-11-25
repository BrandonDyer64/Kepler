#include <cmath>
#include "Test.h"

namespace Kepler {

Test Test::operator+(const Test& other) const {
  return Test(x + other.x, y + other.y);
}

Test Test::operator-(const Test& other) const {
  return Test(x - other.x, y - other.y);
}

Test Test::operator*(const Test& other) const {
  return Test(x * other.x, y * other.y);
}

Test Test::operator/(const Test& other) const {
  return Test(x / other.x, y / other.y);
}

float Test::Dot(const Test& other) const {
  return x * other.x + y * other.y;
}

float Test::DistanceTo(const Test& other) const {
  Test diff = *this - other;
  return std::sqrt(std::pow(diff.x, 2) + std::pow(diff.y, 2));
}

int TestFun3() {
  return 984;
}

}
