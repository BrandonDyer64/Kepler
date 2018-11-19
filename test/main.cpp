#include <iostream>
#include "Engine/DesktopApplication.h"
#include "Math/Vectors/Vec2.h"

int main() {
    Kepler::DesktopApplication app(false, "Kepler Test");
    app.WaitForClose();
    return 0;
}
