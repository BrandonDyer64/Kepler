#ifndef WORLD_H
#define WORLD_H

#include "../World/Actor.h"
#include "GroupManager.h"
#include "ImmutableBag.h"
#include "TagManager.h"

namespace Kepler {
class Entity;
class EntityManager;
class SystemManager;

/**
 * The primary instance for the framework. It contains all the managers.
 *
 * You must use this to create, delete and retrieve entities.
 *
 * It is also important to set the delta each game loop iteration, and
 * initialize before game loop.
 */
class World {
public:
  World();
  ~World();
  SystemManager *GetSystemManager();
  EntityManager *GetEntityManager();
  TagManager *getTagManager();
  GroupManager *getGroupManager();
  float GetDelta();
  void SetDelta(float delta);
  void deleteEntity(Entity &e);
  void refreshEntity(Entity &e);
  Entity &createEntity();
  Entity &getEntity(int entityId);
  void LoopStart();

private:
  SystemManager *systemManager;
  EntityManager *entityManager;
  TagManager *tagManager;
  GroupManager *groupManager;
  float delta;
  Bag<Entity *> refreshed;
  Bag<Entity *> deleted;
};
};     // namespace Kepler
#endif // $(Guard token)
