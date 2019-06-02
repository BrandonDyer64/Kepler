#ifndef Display_hpp
#define Display_hpp

#include <string>

#define DISPLAY_FRAME_VERTICAL 0
#define DISPLAY_FRAME_HORIZONTAL 1

namespace Kepler {

class Display {
public:
  Display(int, int, std::string);

  void CreateFrame();

  bool IsOpen();
  void OpenWindow();

  int FrameDirection();
  void FrameDirection(int);

  int FrameWrap();
  void FrameWrap(int);

};

}

#endif
