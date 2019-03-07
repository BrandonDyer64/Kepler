#include "AngelActor.h"
#include "Engine/Game.h"
#include <angelscript.h>
#include <scriptarray/scriptarray.h>
#include <scriptstdstring/scriptstdstring.h>
#include <scriptbuilder/scriptbuilder.h>

namespace Kepler {

void AngelMessageCallback(const asSMessageInfo *msg, void *param) {
  const char *type = "ERR ";
  if (msg->type == asMSGTYPE_WARNING) {
    type = "WARN";
    return;
  }
  else if (msg->type == asMSGTYPE_INFORMATION) {
    type = "INFO";
    return;
  }
  std::cout << "Exeption - " << msg->message << std::endl;
  printf("    at %s:%d:%d\n", msg->section, msg->row, msg->col);
}

AngelActor::AngelActor(std::string name): Actor(name + "_angel") {
  CScriptBuilder builder;
  builder.StartNewModule((asIScriptEngine *)Game::game->angelScriptEngine, name.c_str());
  builder.AddSectionFromFile(("data/" + name + ".as").c_str());
  builder.BuildModule();
  asIScriptModule *module = ((asIScriptEngine *)Game::game->angelScriptEngine)->GetModule(name.c_str());
  this->module = (void *) module;
  asIScriptFunction *createFun = module->GetFunctionByDecl("void Create(int)");
  this->createFun = (void *) createFun;
  asIScriptFunction *tickFun = module->GetFunctionByDecl("void Tick(int, float)");
  this->tickFun = (void *) tickFun;
}

void AngelActor::Create(Entity &entity, void *settings) {
  asIScriptContext *ctx = ((asIScriptEngine *)Game::game->angelScriptEngine)->CreateContext();
  asIScriptFunction *fun = (asIScriptFunction *) createFun;
  ctx->Prepare(fun);
  ctx->SetArgDWord(0, entity.GetId());
  ctx->Execute();
  ctx->Release();
}

void AngelActor::Tick(Entity &entity, float delta) {
  asIScriptContext *ctx = ((asIScriptEngine *)Game::game->angelScriptEngine)->CreateContext();
  asIScriptFunction *fun = (asIScriptFunction *) tickFun;
  ctx->Prepare(fun);
  ctx->SetArgDWord(0, entity.GetId());
  ctx->SetArgFloat(1, delta);
  ctx->Execute();
  ctx->Release();
}

}
