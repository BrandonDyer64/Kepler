#include "../RenderAPI.h"
#include "Engine/Artemis.h"
#include <string>

namespace Kepler {

class VulkanSystem : public RenderAPI {
public:
  VulkanSystem() : RenderAPI("Vulkan") {}
  virtual void Launch(int width, int height, std::string title,
                      bool fullscreen);
};

} // namespace Kepler
