
#ifndef DesktopApplication_h
#define DesktopApplication_h

#include "DesktopApplication.h"

namespace Kepler {

class DesktopApplication {
private:
  void* window;
  void* vulkanInstance;
public:
  DesktopApplication(bool isFullscreen, const char* title);
  void WaitForClose();
};

}

#endif
