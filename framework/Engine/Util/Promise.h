#ifndef Promise_h
#define Promise_h

#include <functional>
#include <queue>

#define PROMISE_PENDING   0
#define PROMISE_FULFILLED 1
#define PROMISE_REJECTED  2

#define PClose(x) (void*)&x
#define POpen(a) *((a *)value)

namespace Kepler::Util {

class Promise {
public:
  std::queue<std::function<void *(void *)>> functions;
  std::function<void()> catchFunction;

private:
  int status = PROMISE_PENDING;
  void *currentValue;

public:
  Promise(std::function<void(Promise &)> function);

  Promise &Then(std::function<void *(void *)>);
  Promise &Catch(std::function<void()>);

  void Resolve(void *value);
  void Reject();

  int GetStatus();
};

}

#endif
