#ifndef Keys_h
#define Keys_h

#include <string>

namespace Kepler {

#define KEY_VALUES_INCLUDE
#ifdef __unix__
#include "KeyValuesUnix.h"
#endif
#ifdef _WIN32
#include "KeyValuesWindows.h"
#endif
#undef KEY_VALUES_INCLUDE

std::string getKeyName(int scancode) {
  if (scancode >= 284)
    scancode -= 200;
  return scancode <= 140 ? keys[scancode] : "";
}

} // namespace Kepler

#endif
