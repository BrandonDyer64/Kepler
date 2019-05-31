---
title: Shader
---

# Shader.hpp

For making shaders

## Namespace

```cpp
Kepler::Display
```

## Example

```cpp
#include <Display/Shader.hpp>

using namespace Kepler::Display;

std::string fragmentShader = R"(
  void main() {
    color = vec4(1., 0., 0., 1.);
  }
)";

void main() {
  // ...

  Shader myShader(fragmentShader);

  while(loop) {

    myShader.Use();

    // ...
  }
}
```

## Methods

### Constructor

```cpp
Shader::Shader(string fragmentSource);
```

- `[in] fragmentSource`: The source code of the fragment shader to be displayed
across the entire screen. This is expected to be the entire display pipeline.

Creates a new `Shader` object.

### Use()

```cpp
void Shader::Use();
```

Tells OpenGL to use the current shader.

### GetProgram() <span class="badge proposed" />

```cpp
int Shader::GetProgram();
```

Returns the OpenGL program id.
