#include "testo.as"

class TestaActoro : Actor {
  
  void Create(Entity @entity, Agordo agordoj) {
    //* K_COMPONENT(public mesh)
    entity.AddComponent(nova MasxoIngredienco());
    string nomo;
    if (agordoj.Nomo) {
      nomo = paramoj.Nomo;
    } else {
      nomo = "Testa Actoro";
    }
    entity.AddComponent(nova NomoIngredienco(nomo));
  }
  
  void Tick(Entity @entity) {
    // Rigardu la fotilon
    Quaternion turno = entity.AkiruIngrediencon("Rotation").quat;
    Fotilo fotilo = entity.mondo.fotilo;
    turno.Rigardu(fotilo.pozicio);
  }
  
}