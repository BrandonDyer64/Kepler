#include "Game.h"
#include <iostream>

namespace Kepler {

Game::Game() {
#ifdef __Platform
  std::cout << "Platform: " << __Platform << std::endl;
  std::cout << "Render Engine: " << __RenderEngine << std::endl;
  std::cout << "Server: " << (__IsServer ? "yes" : "no") << std::endl;
#endif
}

} // namespace Kepler
