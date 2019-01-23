#include <Engine/Util/Promise.h>
#include <iostream>
#include <string>

using Kepler::Util::Promise;

void TestPromise() {
  Promise([](Promise promise) {
    std::cout << "PROMISE" << std::endl;
    std::string *data = new std::string("data");
    std::cout << data << std::endl;
    promise.Resolve((void*)data);
  })
  .Then([](void *value) -> void * {
    std::cout << value << std::endl;
    return nullptr;
  });
}
