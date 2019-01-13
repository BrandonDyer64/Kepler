#ifndef Window_h
#define Window_h

#define WINDOW_INCLUDE

#include "WindowBase.h"
#include <string>

#ifdef WINDOW_MANAGER_GLFW3
#include "GLFW3/Window.h"
#endif

#ifndef WINDOW_MANAGER
namespace Kepler {
typedef WindowBase Window;
}
#endif

#undef WINDOW_INCLUDE

#endif
