#include "Game.h"
#include <iostream>

namespace Kepler {

Game::Game(World &world, Level *level, SystemManager *sm, EntityManager *em)
    : world(world), // World
      level(level), // Level
      sm(sm),       // System Manager
      em(em)        // Entity Manager
{
  std::cout << "Making window" << std::endl;
  window = new Window(1280, 720, "test");
  window->game = this;
}

void Game::Launch() {}

Game *Game::AddActor(Actor *actor) {
  this->actors.insert(std::pair<std::string, Actor *>(actor->name, actor));
  return this;
}

Actor *Game::GetActor(std::string name) {
  auto search = actors.find(name);
  if (search != actors.end()) {
    return search->second;
  } else {
    std::cout << "Can't find Actor: " << name << std::endl;
    return nullptr;
  }
}

bool Game::GetKeyState(std::string key) {
  auto search = keyStates.find(key);
  return search != keyStates.end() ? search->second : false;
}

void Game::SetKeyState(std::string key, bool state) { keyStates[key] = state; }

} // namespace Kepler
