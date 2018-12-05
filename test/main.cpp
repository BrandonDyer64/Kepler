#include "Engine/DesktopApplication.h"
#include "Math/Vectors/Vec2.h"
#include "MyLevel.h"
#include <iostream>

int main() {
  MyLevel startingLevel;
  Kepler::CreateDesktopApplication(startingLevel);
  return 0;
}
