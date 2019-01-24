#ifndef UnitTest_h
#define UnitTest_h

#include <Engine/Util/Promise.h>
#include <iostream>

using Kepler::Util::Promise;

class UnitTest {
public:
  UnitTest(std::string name, Promise &promise) {
    promise
    .PCThen(void, value, [name], {
      std::cout << "PASSED: " << name << std::endl;
      return nullptr;
    })
    .PCCatch([name], {
      std::cout << "FAILED: " << name << std::endl;
    });
  }
};

#endif
