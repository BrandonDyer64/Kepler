#include "test.as"

class TestAngel : Actor {

  void Create(Entity @entity) {
    //* K_COMPONENT(public mesh)
    entity.AddComponent(new PositionComponent(0, 0));
  }

  void Tick(Entity @entity) {
  }
}
