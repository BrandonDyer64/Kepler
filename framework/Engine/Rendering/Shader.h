#ifndef Shader_h
#define Shader_h

namespace Kepler {

class Shader {
public:
  void* data;
  std::string filename;
  Shader(std::string &filename): filename(filename) {};
};

}

#endif
