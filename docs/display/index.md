---
sort_order: 5
---

# Display

```
npm i --save kepler-display
```

## Examples

### C++

```cpp
#include <Display/Display.hpp>

void main() {
  Display myDisplay(1280, 720, "Hello, World!");

  myDisplay.OpenWindow();
  myDisplay.CreateFrame();

  if (myDisplay.IsOpen()) {
    DisplayContext context = myDisplay.GetContext();
    // ... Make magic
  }
}
```

### JavaScript

```js
const Display = require('kepler-display');

const myDisplay = new Display(1280, 720, "Hello, World!");

myDisplay
  .openWindow()
  .createFrame()
  .startLoop(context => {
    // ... Make magic
  })
```
