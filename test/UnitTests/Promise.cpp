#include "../UnitTest.h"
#include <iostream>
#include <string>

using Kepler::Util::Promise;

void TestPromise() {
  UnitTest("Promise",
    Promise([](Promise &promise) {
      int *a = new int;
      *a = 128;
      promise.Resolve(PClose(a));
    })
    .PThen(int, a, {
      if (*a == 128) {
        std::string *str = new std::string("myteststring");
        return PClose(str);
      } else {
        throw 1;
      }
    })
    .PThen(std::string, str, {
      if (*str != "myteststring") {
        throw 1;
      }
      return nullptr;
    })
  );
}
