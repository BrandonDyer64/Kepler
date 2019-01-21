#ifndef Conversions_h
#define Conversions_h

#include <math.h>

inline float toRadians(float degrees) { return degrees * (M_PI / 180.f); }
inline float toDegrees(float radians) { return radians * (180.f / M_PI); }


#endif
