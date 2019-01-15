#ifndef Window_h
#define Window_h

#include "../World/Rendering/Mesh.h"
#include <iostream>
#include <string>

namespace Kepler {

class Mesh;

class Window {
public:
  Game *game;

private:
  void *window;

public:
  Window(int w, int h, std::string t);
  void RenderBegin();
  void RenderEnd();
  void PollEvents();
  bool ShouldClose();
  void Terminate();
  void SetupMesh(Mesh *mesh);
};

} // namespace Kepler

#endif
