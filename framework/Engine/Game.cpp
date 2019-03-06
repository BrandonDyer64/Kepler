#include "Game.h"
#include "World/Components/ActorComponent.h"
#include <iostream>

namespace Kepler {

Game *Game::game;

Game::Game(std::string name, World &world, SystemManager *sm, EntityManager *em)
    : world(world), // World
      sm(sm),       // System Manager
      em(em)        // Entity Manager
{
  std::cout
    << "Opening Window: "
    << Window::windowAPI
    << " - "
    << Window::renderAPI
    << std::endl;
  window = new Window(1920 / 2, 1080 / 2, name + " - " + Window::renderAPI);
  window->game = this;
}

void Game::Launch() {}

void Game::Run() {
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

Game &Game::Create(std::string name, std::vector<EntitySystem *> &systems) {
  World world;
  SystemManager *sm = world.GetSystemManager();
  EntityManager *em = world.GetEntityManager();
  Game &game = *new Game(name, world, sm, em);
  // Add systems
  game.systems = systems;
  for (auto i : systems) {
    sm->SetSystem(i);
  }
  Game::game = &game;
  return game;
}

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

Entity &Game::SpawnActor(Actor *actor) {
  Entity &entity = em->Create();
  entity.AddComponent(new ActorComponent(actor));
  entity.Refresh();
  actor->Create(entity);
  return entity;
}

Entity &Game::SpawnActor(std::string actor) {
  // ...
  return SpawnActor(actor);
}

bool Game::GetKeyState(std::string key) {
  auto search = keyStates.find(key);
  return search != keyStates.end() ? search->second : false;
}

void Game::SetKeyState(std::string key, bool state) { keyStates[key] = state; }

void Game::KeyTyped(std::string key, bool shift, bool ctrl) {
  std::cout << key << std::endl;
}

void Game::AddGamepad(void *gamepad) {
  gamepads.push_back(gamepad);
}

void Game::RemoveGamepad(void *gamepad) {

}

} // namespace Kepler
