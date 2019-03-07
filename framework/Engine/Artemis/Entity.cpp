#include "Component.h"
#include "Entity.h"
#include "World.h"
#include <sstream>
//#include "EntityManager.h"

using namespace std;

namespace Kepler {

Entity::Entity(World *world, int id) {
  this->world = world;
  this->entityManager = world->GetEntityManager();
  this->id = id;
}

Entity::~Entity() {
  world = NULL;
  entityManager = NULL;
}

void Entity::addSystemBit(bitset<BITSIZE> bit) { systemBits |= bit; }

void Entity::addTypeBit(bitset<BITSIZE> bit) { typeBits |= bit; }

Component *Entity::GetComponent(ComponentType &type) {
  return entityManager->GetComponent(*this, type);
}

ImmutableBag<Component *> &Entity::GetComponents() {
  return entityManager->GetComponents(*this);
}

int Entity::GetId() { return id; }

bitset<BITSIZE> Entity::GetSystemBits() { return systemBits; }

bitset<BITSIZE> Entity::getTypeBits() { return typeBits; }

long int Entity::getUniqueId() { return uniqueId; }

bool Entity::isActive() { return entityManager->isActive(this->GetId()); }

void Entity::Refresh() { world->refreshEntity(*this); }

void Entity::AddComponent(Component *c) {
  entityManager->AddComponent(*this, c);
}

void Entity::RemoveComponent(ComponentType &type) {
  entityManager->RemoveComponent(*this, type);
}

void Entity::removeSystemBit(bitset<BITSIZE> bit) { systemBits &= ~bit; }

void Entity::removeTypeBit(bitset<BITSIZE> bit) { typeBits &= ~bit; }

void Entity::reset() {
  typeBits = 0;
  systemBits = 0;
}

void Entity::setGroup(string group) {

  world->getGroupManager()->set(group, *this);
}

void Entity::SetSystemBits(bitset<BITSIZE> systemBits) {
  this->systemBits = systemBits;
}

void Entity::setTag(string tag) {
  world->getTagManager()->subscribe(tag, *this);
}

void Entity::setTypeBits(bitset<BITSIZE> typeBits) {
  this->typeBits = typeBits;
}

void Entity::SetUniqueId(long int uniqueId) { this->uniqueId = uniqueId; }

std::string Entity::toString() {
  std::ostringstream oss;
  oss << "Entity[" << id << "]\n";
  return oss.str();
}

void Entity::remove() { world->deleteEntity(*this); }
}; // namespace Kepler
