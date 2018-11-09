#include <iostream>
#include "Math/Vectors/Vec2.h"

int main() {
  Kepler::Vec2 a(1, 2);
  Kepler::Vec2 b(2, 3);
  Kepler::Vec2 c = a + b;
  std::cout << c.x << std::endl;
  std::cout << Kepler::TestFun() << std::endl;
  return 0;
}
