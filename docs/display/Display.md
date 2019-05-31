---
title: Display
source_file: Display/include/display/Display.hpp
---

{% include source_loc.html %}

# Display.hpp

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

### CreateFrame

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

### OpenWindow <a href="{{file_loc}}#L3" class="srclink" />

```cpp
void Display::OpenWindow();
```

Makes the window open into the users screen.
