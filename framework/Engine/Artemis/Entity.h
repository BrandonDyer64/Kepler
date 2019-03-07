#ifndef ENTITY_H
#define ENTITY_H

#include "BitSize.h"
#include "ComponentTypeManager.h"
#include "EntityManager.h"
#include "ImmutableBag.h"
#include <bitset>
#include <cstddef>
#include <string>
#include <typeinfo>

namespace Kepler {

class Component;
class ComponentType;
class World;
// class EntityManager;

/**
 * The entity class. Cannot be instantiated outside the framework, you must
 * create new entities using World.
 */
class Entity {

private:
  int id;
  long int uniqueId;
  std::bitset<BITSIZE> typeBits;
  std::bitset<BITSIZE> systemBits;

  // No copy constructor
  Entity(const Entity &);
  // No assign operator
  Entity &operator=(const Entity &);

protected:
  World *world;
  EntityManager *entityManager;

public:
  Entity(World *world, int id);
  ~Entity();
  int GetId();
  void SetUniqueId(long int uniqueId);
  long int getUniqueId();

  std::bitset<BITSIZE> getTypeBits();
  void addTypeBit(std::bitset<BITSIZE> bit);
  void removeTypeBit(std::bitset<BITSIZE> bit);
  std::bitset<BITSIZE> GetSystemBits();
  void addSystemBit(std::bitset<BITSIZE> bit);
  void removeSystemBit(std::bitset<BITSIZE> bit);
  void SetSystemBits(std::bitset<BITSIZE> systemBits);
  void setTypeBits(std::bitset<BITSIZE> typeBits);
  void reset();

  std::string toString();

  void AddComponent(Component *c);

  // Might change to non template
  template <typename c> void RemoveComponent() {
    entityManager->RemoveComponent(*this,
                                   ComponentTypeManager::getTypeFor<c>());
  }

  void RemoveComponent(ComponentType &type);

  Component *GetComponent(ComponentType &type);

  template <typename c> Component *GetComponent() {
    return (c *)entityManager->GetComponent(
        *this, ComponentTypeManager::getTypeFor<c>());
  }

  ImmutableBag<Component *> &GetComponents();

  bool isActive();
  void Refresh();
  void remove();
  void setGroup(std::string group);
  void setTag(std::string tag);
};
};     // namespace Kepler
#endif // $(Guard token)
