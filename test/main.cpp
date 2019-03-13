#include "Engine/Artemis.h"
#include "Engine/Game.h"
#include "Engine/Systems/DebugSystem.h"
#include "Engine/Systems/ActorSystem.h"
#include "Engine/World/Particles/ParticleSystem.h"
#include "Engine/World/Particles/Particle.h"
#include "Math/Vectors/Vec2.h"
#include "TestActor.h"
#include <iostream>
#include <vector>

void TestPromise();
void TestQuaternion();

using namespace Kepler;

int main() {
  // Unit Tests
  TestPromise();
  TestQuaternion();

  ParticleSystem particleSystem(10);

  std::cout << "Particle system done." << std::endl;

  for (int i = 0; i < 5; i++) {
    Particle *particle = new(particleSystem) Particle();
    Particle *particle2 = new(particleSystem) Particle();
    std::cout << particle << " " << particle2 << std::endl;
    particleSystem.Delete(particle);
  }

  return 0;

  // Create Simulation
  std::vector<Kepler::EntitySystem *> systems;
  systems.push_back(new Kepler::DebugSystem());
  systems.push_back(new Kepler::ActorSystem());
  Kepler::Game game = Kepler::Game::Create("Kepler Test", systems);

  // Add Custom Actors
  Kepler::Actor *testActor = new TestActor();
  game.AddActor(testActor);
  float pos[] = { 0, 0, 0 };
  game.SpawnActor(testActor, pos);

  // Run Simulation
  game.Launch();
  game.Run();

  return 0;
}
