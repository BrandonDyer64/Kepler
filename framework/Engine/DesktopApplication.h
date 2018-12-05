
#ifndef DesktopApplication_h
#define DesktopApplication_h

#include "../Math/Vectors/Vec2.h"
#include "../Math/Vectors/Vec3.h"
#include "../Rendering/MeshTypes/MeshObj.h"
#include "../Rendering/Vertex.h"
#include "../World/Actors/Level.h"
#include "Tools/FS.h"
#include <string>

namespace Kepler {
void CreateDesktopApplication(Level &startingLevel);
}

#endif
