#ifndef Window_h
#define Window_h

#include "../World/Rendering/Mesh.h"
#include "Shader.h"
#include <iostream>
#include <string>
#include <map>

namespace Kepler {

class Mesh;

class Window {
public:
  Game *game;
  unsigned int buffer = 0;
  static const std::string windowAPI;
  static const std::string renderAPI;

private:
  void *window;
  std::map<std::string, Shader *> shaders;

public:
  Window(int w, int h, std::string t);
  void RenderBegin();
  void RenderEnd();
  void PollEvents();
  bool ShouldClose();
  void Terminate();
  void SetupMesh(Mesh *mesh);
  double GetTime();
  Shader &GetShader(std::string &filename);

private:
  void SetupInput();
  void CompileShader(Shader *shader);
};

} // namespace Kepler

#endif
