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
  void *angelScriptEngine;

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
  void Run();
  static Game &Create(std::string name, std::vector<EntitySystem *> &systems);
  static Game &Create(std::string name) {
    std::vector<EntitySystem *> systems;
    return Create(name, systems);
  }
  Game *AddActor(Actor *actor);
  Actor *GetActor(std::string name);
  Entity &SpawnActor(Actor *actor);
  Entity &SpawnActor(std::string actor);
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
