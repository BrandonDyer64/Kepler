#ifndef Game_h
#define Game_h

#include "Artemis.h"
#include "Engine/Rendering/Window.h"
#include "World/Actor.h"
#include "World/Level.h"
#include <map>
#include <thread>
#include <vector>

#ifdef _WIN32
#include <windows.h>
#endif

namespace Kepler {

typedef std::vector<EntitySystem *> tESIter;

class Game {
public:
  static Game *game;
  float currentTime = 0;

private:
  Window *window;
  World &world;
  Level *level;
  SystemManager *sm;
  EntityManager *em;
  std::vector<EntitySystem *> systems;
  std::map<std::string, Actor *> actors;
  bool isRunning = true;
  std::map<std::string, bool> keyStates;
  std::vector<void *> gamepads;

public:
  Game(std::string name, World &world, SystemManager *sm, EntityManager *em);
  void Launch();
  void Run() {
    using namespace std::chrono_literals;
    using clock = std::chrono::high_resolution_clock;
    double oldTime = window->GetTime();
    while (!window->ShouldClose()) {
      window->RenderBegin();
      {
        double newTime = window->GetTime();
        float deltaTime = (float)(newTime - oldTime);
        oldTime = newTime;
        world.LoopStart();
        world.SetDelta(deltaTime);
        for (auto i : systems) {
          i->Process();
        }
      }
      window->RenderEnd();
      #ifdef _WIN32
      Sleep(1);
      #else
      std::this_thread::sleep_for(1ms);
      #endif
      window->PollEvents();
    }
  }
  static void Create(std::string name, std::vector<EntitySystem *> &systems) {
    World world;
    SystemManager *sm = world.GetSystemManager();
    EntityManager *em = world.GetEntityManager();
    Game game(name, world, sm, em);
    // Add systems
    game.systems = systems;
    for (auto i : systems) {
      sm->SetSystem(i);
    }
    game.Launch();
    game.Run();
  }
  static void Create(std::string name) {
    std::vector<EntitySystem *> systems;
    Create(name, systems);
  }
  Game *AddActor(Actor *actor);
  Actor *GetActor(std::string name);
  // Stop the game
  void Stop() { isRunning = false; }
  Window *GetWindow() { return window; }
  bool GetKeyState(std::string key);
  void SetKeyState(std::string key, bool state);
  void KeyTyped(std::string key, bool shift, bool ctrl);
  void AddGamepad(void *gamepad);
  void RemoveGamepad(void *gamepad);
};

} // namespace Kepler

#endif
