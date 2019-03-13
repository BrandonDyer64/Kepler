#ifndef ParticleSystem_h
#define ParticleSystem_h

namespace Kepler {

struct Particle;

class ParticleSystem {
public:

  ParticleSystem(int size);

  void *Alloc();
  Particle *Create();
  void Dealloc(void *);
  void Delete(Particle *);
private:
  const int size;
  Particle *data;
  void *next;
};

}

#endif
