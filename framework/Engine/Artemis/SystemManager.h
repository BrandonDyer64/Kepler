#ifndef SYSTEM_MANAGER_H
#define SYSTEM_MANAGER_H

#include <map>
#include "ImmutableBag.h"
#include "TypeInfoComparator.h"
#include <iostream>
namespace Kepler {

	class EntitySystem;
	class Entity;
	class World;

	class SystemManager {
  public:
    SystemManager(World &world);
    ~SystemManager();
    void InitializeAll();
    Bag<EntitySystem*> & GetSystems();
    EntitySystem* SetSystem(EntitySystem * stm);

    template<typename eSystem>
    EntitySystem* GetSystem() {
      return (eSystem*)(systems[&typeid(eSystem)]);
    }

  private:
    World * world;
    std::map<const std::type_info*, EntitySystem*, type_info_comparator> systems;
    Bag<EntitySystem*> bagged;
	};
};
#endif // $(Guard token)
