
#ifndef DesktopApplication_h
#define DesktopApplication_h

#include "../Math/Vectors/Vec2.h"
#include "../Math/Vectors/Vec3.h"
#include "../Rendering/MeshTypes/MeshObj.h"
#include "../Rendering/Vertex.h"
#include "Tools/FS.h"
#include <string>

namespace Kepler {
void CreateDesktopApplication(bool isFullscreen, const char *title,
                              std::string model_path, std::string texture_path);
}

#endif
