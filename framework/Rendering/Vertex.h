#ifndef Vertex_h
#define Vertex_h


#ifdef LIB_KEPLER

#define GLFW_INCLUDE_VULKAN
#include <GLFW/glfw3.h>

#define GLM_FORCE_RADIANS
#define GLM_FORCE_DEPTH_ZERO_TO_ONE
#define GLM_ENABLE_EXPERIMENTAL
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtx/hash.hpp>

#endif

#include "../Math/Vectors/Vec3.h"
#include "../Math/Vectors/Vec2.h"

namespace Kepler {

class Vertex {
public:
    Vec3 pos;
    Vec3 color;
    Vec2 texCoord;

    Vertex(Vec3 pos, Vec3 color, Vec2 texCoord): pos(pos), color(color), texCoord(texCoord) {};

    #ifdef LIB_KEPLER
    static VkVertexInputBindingDescription GetBindingDescription();

    static std::array<VkVertexInputAttributeDescription, 3> GetAttributeDescriptions();
    #endif

    bool operator==(const Vertex& other) const {
        return pos == other.pos && color == other.color && texCoord == other.texCoord;
    }
};

}

#ifdef LIB_KEPLER
namespace std {

  template<>
  struct hash<Kepler::Vec2> {
      size_t operator()(const Kepler::Vec2& vec) const {
          return ((hash<float>()(vec.x)
                ^ (hash<float>()(vec.y) << 1)) >> 1)
                ^ (hash<float>()(vec.y) << 1);
      }
  };

  template<>
  struct hash<Kepler::Vec3> {
      size_t operator()(const Kepler::Vec3& vec) const {
          return ((hash<float>()(vec.x)
                ^ (hash<float>()(vec.y) << 1)) >> 1)
                ^ (hash<float>()(vec.z) << 1);
      }
  };

  template<>
  struct hash<Kepler::Vertex> {
      size_t operator()(const Kepler::Vertex& vertex) const {
          return ((hash<Kepler::Vec3>()(vertex.pos)
                ^ (hash<Kepler::Vec3>()(vertex.color) << 1)) >> 1)
                ^ (hash<Kepler::Vec2>()(vertex.texCoord) << 1);
      }
  };

};
#endif

#endif
