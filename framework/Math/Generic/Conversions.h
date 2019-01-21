#ifndef Conversions_h
#define Conversions_h

namespace Kepler {

// To Radians

template<typename T>
T ToRadians(T degrees);

float ToRadians(float degrees);

// To Degrees

template<typename T>
T ToDegrees(T radians);

float ToDegrees(float radians);

}

#endif
