#include "BitSize.h"
#include "Component.h"
#include "Entity.h"
#include "EntityManager.h"
#include "EntitySystem.h"
#include "SystemManager.h"
#include "World.h"

namespace Kepler {
EntityManager::EntityManager(World &world) : componentsByType(64) {
  this->world = &world;

  nextAvailableId = 0;
  count = 0;
  uniqueEntityId = 0;
  totalCreated = 0;
  totalRemoved = 0;
};

void EntityManager::AddComponent(Entity &e, Component *c) {
  ComponentType type = ComponentTypeManager::getTypeFor(typeid(*c));

  if (type.GetId() >= componentsByType.getCapacity()) {
    // Resize
    componentsByType.set(type.GetId(), NULL);
  }

  Bag<Component *> *components = componentsByType.get(type.GetId());

  if (components == NULL) {
    components = new Bag<Component *>();
    componentsByType.set(type.GetId(), components);
  } else {
    if (components->get(e.GetId()) != NULL) {
      // Entity already had this component, need to perform component removal
      // first
      RemoveComponent(e, type);
      Refresh(e);
    }
  }
  components->set(e.GetId(), c);
  e.addTypeBit(type.getBit());

  components = NULL;
};

Entity &EntityManager::Create() {

  Entity *e = this->removedAndAvailable.removeLast();

  if (e == NULL) {
    e = new Entity(this->world, nextAvailableId++);
  } else {
    e->reset();
  }

  e->SetUniqueId(uniqueEntityId++);
  activeEntities.set(e->GetId(), e);
  count++;
  totalCreated++;
  return *e;
};

Entity &EntityManager::getEntity(int entityId) {
  return *activeEntities.get(entityId);
};

int EntityManager::getEntityCount() { return count; };

long EntityManager::getTotalCreated() { return totalCreated; };

long EntityManager::getTotalRemoved() { return totalRemoved; };

Component *EntityManager::GetComponent(Entity &e, ComponentType &type) {

  Bag<Component *> *bag = componentsByType.get(type.GetId());

  if (bag != NULL && e.GetId() < bag->getCapacity())
    return bag->get(e.GetId());

  return NULL;
};

/**
 * Retrieves all components for one entity.
 */
Bag<Component *> &EntityManager::GetComponents(Entity &e) {

  entityComponents.clear();

  for (int i = 0; i < componentsByType.getCapacity(); i++) {
    Bag<Component *> *components = componentsByType.get(i);

    if (components != NULL && e.GetId() < components->getCapacity()) {
      Component *c = components->get(e.GetId());

      if (c != NULL) {
        entityComponents.add(c);
      }
    }
  }

  return entityComponents;
};

bool EntityManager::isActive(int entityId) {
  return activeEntities.get(entityId) != NULL;
};

void EntityManager::Refresh(Entity &e) {
  SystemManager *systemManager = world->GetSystemManager();
  Bag<EntitySystem *> &systems = systemManager->GetSystems();
  for (int i = 0; i < systems.getCount(); i++) {
    systems.get(i)->change(e);
  }
};

void EntityManager::remove(Entity &e) {
  activeEntities.set(e.GetId(), NULL);
  e.setTypeBits(0);
  Refresh(e);
  RemoveComponentsOfEntity(e);
  count--;
  totalRemoved++;
  removedAndAvailable.add(&e);
};

void EntityManager::RemoveComponent(Entity &e, ComponentType &type) {
  Bag<Component *> *components = componentsByType.get(type.GetId());

  delete components->get(e.GetId());
  components->set(e.GetId(), NULL);
  e.removeTypeBit(type.getBit());
  components = NULL;
};

void EntityManager::RemoveComponentsOfEntity(Entity &e) {
  for (int i = 0; i < componentsByType.getCapacity(); i++) {
    Bag<Component *> *components = componentsByType.get(i);

    if (components != NULL && e.GetId() < components->getCapacity()) {

      delete components->get(e.GetId());
      components->set(e.GetId(), NULL);
    }

    components = NULL;
  }
};

void EntityManager::removeAllEntities() {

  for (int i = 0; i < activeEntities.getCapacity(); i++) {
    if (activeEntities.get(i) != NULL) {
      remove(*activeEntities.get(i));
    }
  }
}

EntityManager::~EntityManager() {
  // Removes every active entity and puts it in removeAndAvailable.
  // Also calls RemoveComponentsOfEntity. All systems will be updated and will
  // remove each entity.
  this->removeAllEntities();
  // Destroy the data from memory; activeEntities should be empty by now.
  this->removedAndAvailable.deleteData();

  for (int i = 0; i < componentsByType.getCapacity(); i++) {
    if (componentsByType.get(i) == NULL)
      continue;
    componentsByType.get(i)->clear();
  }
  componentsByType.deleteData();
  componentsByType.clear();

  // Does not own world. Only points to it.
  this->world = NULL;
}
}; // namespace Kepler
