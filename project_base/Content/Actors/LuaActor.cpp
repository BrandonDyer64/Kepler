#include <Kepler.h>

class MyActor : public Actor {
  MyActor(Entity *entity): Actor("MyActor") {
    K_COMPONENT_MESH(public)
    entity->AddComponent(new MeshComponent());
  }
}