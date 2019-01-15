#ifndef Vertex_h
#define Vertex_h

#include "Math/Vectors/Vec2.h"
#include "Math/Vectors/Vec3.h"

namespace Kepler {

class Vertex {
public:
  Vec3 position;
  Vec3 normal;
  Vec2 texCoord;

public:
  Vertex(Vec3 p, Vec3 n, Vec2 t);
};

} // namespace Kepler

#endif
