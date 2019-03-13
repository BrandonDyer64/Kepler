#include "Particle.h"
#include "ParticleSystem.h"

namespace Kepler {

Particle::Particle(Vec3 pos, Vec3 vel): position(pos), velocity(vel) {
  
}

void *Particle::operator new(std::size_t size, ParticleSystem &system) {
  return system.Alloc();
}

void Particle::operator delete(void *mem, ParticleSystem &system) {
  system.Dealloc((void *) mem);
}

}
