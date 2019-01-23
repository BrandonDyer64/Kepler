#include "Promise.h"
#include <iostream>
namespace Kepler::Util {

Promise::Promise(std::function<void(Promise &)> function) {
  function(*this);
}

Promise &Promise::Then(std::function<void *(void *)> function) {
  functions.push(function);
  std::cout << status << std::endl;
  if (status == PROMISE_FULFILLED) {
    Resolve(currentValue);
  }
  return *this;
}

Promise &Promise::Catch(std::function<void()> function) {
  catchFunction = function;
  return *this;
}

void Promise::Resolve(void *value) {
  currentValue = value;
  while (functions.size() > 0) {
    std::function<void *(void *)> next = functions.front();
    try {
      currentValue = next(currentValue);
    } catch(...) {
      Reject();
      return;
    }
    functions.pop();
  }
  status = PROMISE_FULFILLED;
}

void Promise::Reject() {
  /*
  while (functions.size() > 0) {
    std::function<void *(void *)> next = functions.front();
    functions.pop();
  }
  */
  if (catchFunction) {
    catchFunction();
  }
}

}
