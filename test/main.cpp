#include "Engine/DesktopApplication.h"
#include "Math/Vectors/Vec2.h"
#include <iostream>

int main() {
  Kepler::CreateDesktopApplication(false, "hello world", "data/chalet.obj",
                                   "data/chalet.jpg");
  return 0;
}
