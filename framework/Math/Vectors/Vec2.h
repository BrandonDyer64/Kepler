
#ifndef Vec2_h
#define Vec2_h

class Vec2 {
public:
  const float x;
  const float y;
public:
  Vec2(float x, float y): x(x), y(y) {};
  Vec2 operator+(const Vec2& other) const;
  Vec2 operator-(const Vec2& other) const;
  Vec2 operator*(const Vec2& other) const;
  Vec2 operator/(const Vec2& other) const;
  float Dot(const Vec2& other) const;
  float DistanceTo(const Vec2& other) const;
};

#endif
