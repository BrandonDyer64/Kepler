#ifndef MeshObj_h
#define MeshObj_h

#include <string>
#include <unordered_map>
#include "../Mesh.h"
#include "../../Engine/TinyObjLoader.h"

namespace Kepler {

class MeshObj : public Mesh {
public:
  MeshObj(std::string filename);
};

}

#endif