#include "World.h"
#include "Entity.h"
#include "SystemManager.h"
#include "EntityManager.h"
#include "SystemBitManager.h"
#include "ComponentType.h"


namespace Kepler {

	World::World() {
		//TODO add more managers
		this->systemManager = new SystemManager(*this);
		this->entityManager = new EntityManager(*this);
		this->groupManager = new GroupManager();
		this->tagManager = new TagManager();
		delta = 0;
	}

	void World::deleteEntity(Entity& e) {
		if(!deleted.contains(&e))
			deleted.add(&e);
	}

	float World::GetDelta() {
		return this->delta;
	}

	SystemManager* World::GetSystemManager() {
		return systemManager;
	}

	EntityManager* World::GetEntityManager() {
		return entityManager;
	}

	GroupManager* World::getGroupManager(){
		return groupManager;
	}

	TagManager* World::getTagManager(){
		return tagManager;
	}

	void World::LoopStart() {
		if(!refreshed.isEmpty()) {
			for(int i=0; i<refreshed.getCount(); i++) {
				//TODO ADD  MANAGERs
				entityManager->Refresh(*refreshed.get(i));
			}

			refreshed.clear();

		}
		if(!deleted.isEmpty()) {
			for(int i=0; i<deleted.getCount(); i++) {
				Entity & e = *deleted.get(i);
				groupManager->remove(e);
				tagManager->remove(e);
				entityManager->remove(e);
			}

			deleted.clear();
		}

	}

	Entity& World::createEntity() {
		return entityManager->Create();
	}

	Entity& World::getEntity(int entityId) {
		return entityManager->getEntity(entityId);
	}


	void World::refreshEntity(Entity& e) {
		refreshed.add(&e);
	}

	void World::SetDelta(float delta) {
		this->delta = delta;
	}

	World::~World() {
		//Entity manager should be deleted first.
    refreshed.clear();
    deleted.clear();

		delete entityManager;
		delete systemManager;
		delete groupManager;
		delete tagManager;
		ComponentTypeManager::deleteComponentTypes();
		SystemBitManager::removeBitSets();
    ComponentType::reset();
	}
};
