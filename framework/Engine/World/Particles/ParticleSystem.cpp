#include "ParticleSystem.h"
#include "Particle.h"

namespace Kepler {

  struct ParticlePointer {
    Particle *next;
  };

ParticleSystem::ParticleSystem(int size): size(size) {
  data = new Particle[size];
  next = (void *) data;
  for (int i = 0; i < size - 1; i++) {
    ParticlePointer *pointer = (ParticlePointer *) (void *) &data[i];
    pointer->next = &data[i + 1];
    std::cout << pointer << " " << pointer->next << std::endl;
  }
}

void *ParticleSystem::Alloc() {
  ParticlePointer *pointer = (ParticlePointer *) next;
  next = (void *) pointer->next;
  return (void *) pointer;
}

Particle *ParticleSystem::Create() {
  return (Particle *) Alloc();
}

void ParticleSystem::Dealloc(void *mem) {
  ParticlePointer *pointer = (ParticlePointer *) mem;
  pointer->next = (Particle *) next;
  next = (void *) pointer;
}

void ParticleSystem::Delete(Particle *particle) {
  Dealloc((void *) particle);
}

}
