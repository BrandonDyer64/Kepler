#ifndef Texture_h
#define Texture_h

#include <string>

namespace Kepler {

class Texture {
public:
  unsigned int id;
  std::string type;

  Texture(unsigned int id, std::string type) : id(id), type(type) {}
};

} // namespace Kepler

#endif
