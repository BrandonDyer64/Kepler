#ifndef Mesh_h
#define Mesh_h

#include <cstdint>
#include <vector>
#include <unordered_map>
#include "Vertex.h"

namespace Kepler {
  class Mesh {
  public:
    std::vector<Vertex> vertices;
    std::vector<uint32_t> indices;
    Mesh() {};
    Mesh(std::vector<Vertex> vertices, std::vector<uint32_t> indices): vertices(vertices), indices(indices) {};
    Mesh& GetFrame(float time, float delta);
  };
}

#endif
