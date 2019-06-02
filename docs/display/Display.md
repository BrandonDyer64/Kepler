---
title: Display
header_file: Display/include/display/Display.hpp
source_file: Display/src/Display.cc
---

# Display.hpp {% include header_link.html line=9 %}

## Namespace

```cpp
Kepler::Display
```

## Methods

### Constructor

```cpp
Display::Display(int width, int height, string title);
```

- `[in] width`: The width of the window.
- `[in] height`: The height of the window.
- `[in] title`: The name at the top of the window.

Creates a new `Display` object.

Note: `width` and `height` have no affect on consoles.

### CreateFrame {% include source_link.html line=13 %}

```cpp
void Display::CreateFrame();
```

Adds a drawable frame to the window and creates a context for it.
Create multiple for split screen.

### IsOpen

```cpp
bool Display::IsOpen();
```

Returns whether or not the window is still open in the current desktop
environment.

### OpenWindow {% include source_link.html line=3 %}

```cpp
void Display::OpenWindow();
```

Makes the window open into the users screen.

### FrameDirection

```cpp
int Display::FrameDirection();
```

```cpp
void Display::FrameDirection(int direction);
```

- `[in] direction`:
  - `0 | DISPLAY_FRAME_VERTICAL`: vertical
  - `1 | DISPLAY_FRAME_HORIZONTAL`: horizontal

Sets whether multiple frames should be aligned vertically or horizontally.
Defaults horizontal.

### FrameWrap

```cpp
int Display::FrameWrap();
```

```cpp
void Display::FrameWrap(int frames);
```

- `[in] frames`: Number of frames to show until wrapping to a new line.

Defaults 2.
