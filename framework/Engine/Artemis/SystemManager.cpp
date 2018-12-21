#include "SystemManager.h"
#include "World.h"
#include "EntitySystem.h"
#include "SystemBitManager.h"

namespace Kepler {
	
  SystemManager::SystemManager(World& world) {
    this->world = &world;
  }
  
  Bag<EntitySystem*> & SystemManager::GetSystems() {
    return bagged;
  }
  
  void SystemManager::InitializeAll() {
    for(int i=0; i< bagged.getCount(); i++) {
      bagged.get(i)->initialize();
    }
    
  }
  
  EntitySystem* SystemManager::SetSystem(EntitySystem* stm) {
    bool bitFlag = false;
    int index = 0;
    
    //Check if system is known.
    for(int i=0; i< bagged.getCount(); i++)
    {
      if(typeid(*stm) == typeid(*bagged.get(i))){
        bitFlag = true;
        index = i;
      }
    }
    
    //Check if stm pointer doesn't point to an existing system
    //Else add system to manager
    if(bagged.get(index) != stm){
      //If it doesn't point to an existing system
      //Check if the new system is already known
      if(bitFlag){
        //Delete newly made system.
        delete stm;
        //Point to existing system in bag.
        stm = bagged.get(index);
      }
      else{
        stm->setWorld(world);
        systems[&typeid(*stm)]  = stm;
        bagged.add(stm);
        stm->SetSystemBit(SystemBitManager::getBitFor(typeid(*stm)));
      }
    }
    
    return stm;
  }
  
  SystemManager::~SystemManager(){
    systems.clear();
    bagged.deleteData();
    bagged.clear();
  }
};
