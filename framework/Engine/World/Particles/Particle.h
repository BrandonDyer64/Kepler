#ifndef Particle_h
#define Particle_h

#include "Math/Vectors/Vec3.h"

namespace Kepler {

class ParticleSystem;

struct Particle {
  Vec3 position;
  Vec3 velocity;
  Particle() {};
  Particle(Vec3, Vec3);
  void *operator new(std::size_t, ParticleSystem &);
  void operator delete(void *, ParticleSystem &);
};

}

#endif
