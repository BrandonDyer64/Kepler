#ifndef Keys_h
#define Keys_h

#include <string>

namespace Kepler {

#define KEY_VALUES_INCLUDE
#include "KeyValues.h"
#undef KEY_VALUES_INCLUDE

std::string getKeyName(int scancode) {
  return scancode < 120 ? keys[scancode] : "";
}

} // namespace Kepler

#endif
