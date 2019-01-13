#ifndef WindowBase_h
#define WindowBase_h

#include <string>

namespace Kepler {
class WindowBase {
private:
  int width, height;
  std::string title;

public:
  WindowBase(int w, int h, std::string t) : width(w), height(h), title(t) {}
  virtual void RenderBegin() = 0;
  virtual void RenderEnd() = 0;
  virtual void PollEvents() = 0;
  virtual bool ShouldClose() = 0;
  virtual void Terminate() = 0;
};
} // namespace Kepler

#endif
