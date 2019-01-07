
class TestAngel : Actor {

  void Create(Entity @entity) {
    entity.AddComponent(new PositionComponent(0, 0));
  }

  void Tick(Entity @entity) {
    // Every Tick
  }
}
