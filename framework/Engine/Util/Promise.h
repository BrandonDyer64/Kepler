#ifndef Promise_h
#define Promise_h

#include <functional>
#include <queue>

#define PROMISE_PENDING   0
#define PROMISE_FULFILLED 1
#define PROMISE_REJECTED  2

#define PClose(x) (void*)x
#define POpen(a) ((a *)value)

#define PThen(type, name, function)           \
  Then([](void *promise_value) -> void * {            \
    type *name = (type *) promise_value; function \
  })

#define PCThen(type, name, capture, function)           \
  Then(capture(void *promise_value) -> void * {            \
    type *name = (type *) promise_value; function \
  })

#define PCatch(function)           \
  Catch([]() {            \
    function \
  })

#define PCCatch(capture, function)           \
  Catch(capture() {            \
    function \
  })

namespace Kepler::Util {

class Promise {
public:
  std::queue<std::function<void *(void *)>> functions;
  std::function<void()> catchFunction;

private:
  int status = PROMISE_PENDING;
  void *currentValue;

private:
  Promise();

public:
  Promise(std::function<void(Promise &)> function);
  Promise(const Promise& other);

  Promise &Then(std::function<void *(void *)>);
  Promise &Catch(std::function<void()>);

  void Resolve(void *value);
  void Reject();

  int GetStatus();

  static void All(Promise *output, Promise *promises[], int num);
};

}

#endif
