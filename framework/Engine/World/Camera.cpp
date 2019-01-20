#include "Camera.h"

namespace Kepler {

Camera::Camera(Vec3 position, Quaternion rotation)
  : position(position),
    rotation(rotation)
    {}

Camera::Camera(Vec3 position, Quaternion rotation, float size)
  : position(position),
    rotation(rotation),
    size(size)
    {}

Camera::Camera(Vec3 position, Quaternion rotation, float size, bool isPerspective)
  : position(position),
    rotation(rotation),
    size(size),
    isPerspective(isPerspective)
    {}

Mat4 Camera::GetProjectionMatrix() {
  // TODO: Camera GetProjectionMatrix
  return Mat4::Identity();
}

}
