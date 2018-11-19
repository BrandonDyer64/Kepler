
#ifndef Test_h
#define Test_h

namespace Kepler {

  class Test {
  public:
    const float x;
    const float y;
  public:
    Test(): x(0), y(0) {};
    Test(float x, float y): x(x), y(y) {};
    Test operator+(const Test& other) const;
    Test operator-(const Test& other) const;
    Test operator*(const Test& other) const;
    Test operator/(const Test& other) const;
    float Dot(const Test& other) const;
    float DistanceTo(const Test& other) const;
  };
  int TestFun3();
}

#endif
