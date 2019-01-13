
#ifndef Vec2_h
#define Vec2_h

namespace Kepler {

class Vec2 {
public:
  union{
    //General Notation
    struct{ const float x, y; };
    //Vector Notation
    struct{ const float i, j; };
  };

public:
  Vec2() : x(0), y(0){};
  Vec2(float x, float y) : x(x), y(y){};
  Vec2 operator+(const Vec2 &other) const;
  Vec2 operator-(const Vec2 &other) const;
  Vec2 operator*(const Vec2 &other) const;
  Vec2 operator/(const Vec2 &other) const;
  bool operator==(const Vec2 &other) const;
  float Dot(const Vec2 &other) const;
  float DistanceTo(const Vec2 &other) const;
};
int TestFun();
int TestFun4();
} // namespace Kepler

#endif
