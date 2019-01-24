#include "Promise.h"
#include <iostream>
namespace Kepler::Util {

Promise::Promise() {}

Promise::Promise(std::function<void(Promise &)> function) {
  function(*this);
}

Promise::Promise(const Promise& other) {
  std::cout << "PROMISE COPY CONSTRUCTOR" << std::endl;
}

Promise &Promise::Then(std::function<void *(void *)> function) {
  functions.push(function);
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
    status = PROMISE_PENDING;
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
  status = PROMISE_REJECTED;
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

int Promise::GetStatus() {
  return status;
}

void Promise::All(Promise *output, Promise *promises[], int num) {
  for (int i = 0; i < num; i++) {
    Promise *promise = promises[i];
  }
}

}
