#include "Engine/Artemis.h"
#include "Engine/Game.h"
#include "Engine/Systems/DebugSystem.h"
#include "Engine/Systems/ActorSystem.h"
#include "Math/Vectors/Vec2.h"
#include "TestActor.h"
#include <iostream>
#include <vector>

void TestPromise();
void TestQuaternion();

int main() {
  // Unit Tests
  TestPromise();
  TestQuaternion();

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
