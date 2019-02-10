//* eo

#include "testo.as"

class TestaActoro : Actor {
  
  void Create(Entity @entity, Agordo agordoj) {
    //* K_COMPONENT(mesh)
    entity.AddComponent(new MasxoIngredienco());
    string name;
    if (agordoj.name) {
      name = agordoj.name;
    } else {
      name = "Testa Actoro";
    }
    entity.AddComponent(new NomoIngredienco(name));
  }
  
  void Tick(Entity @entity) {
    // LookAt la fotilon
    Quaternion turno = entity.GetComponent("Rotation").quat;
    Camera camera = entity.world.camera;
    turno.LookAt(camera.position);
  }
  
}