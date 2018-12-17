#include <iostream>
#include <string>

namespace Kepler {

class RenderAPI {
public:
  RenderAPI(std::string apiName) {
    std::cout << "Render API: " << apiName << std::endl;
  }
  virtual void Launch(int width, int height, std::string title,
                      bool fullscreen);
};

} // namespace Kepler
