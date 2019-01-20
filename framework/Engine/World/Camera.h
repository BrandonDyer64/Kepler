#ifndef Camera_h
#define Camera_h

#include "../../Math/Vectors/Vec3.h"
#include "../../Math/Matrices/Mat4.h"
#include "../../Math/Vectors/Quaternion.h"

namespace Kepler {

class Camera {
public:
  Vec3 position;
  Quaternion rotation;
  bool isPerspective = true;
  float size = 45;

public:
  Camera(Vec3 position, Quaternion rotation);
  Camera(Vec3 position, Quaternion rotation, float size);
  Camera(Vec3 position, Quaternion rotation, float size, bool isPerspective);
  Mat4 GetProjectionMatrix();
};

}

#endif
