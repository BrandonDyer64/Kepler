---
---

# Fractal

To be a visual programming language.

## Fractal Code <span class="badge proposed" />

### Sphere

```c
in radius = 1.;

out rotation = false;

return dist(point, position) - radius;
```

### Simple Cellphone

```c
require("Block")
require("Tube")

in height = range(.12, .08)
in width = range(.03, .05)
in depth = range(.01, .005)
in color = pick(WHITE/5, BLACK/5, PINK/2, BLUE/2 GOLD/1)
in hasCase = boolean(85/100)

return Block(pos, width, height, depth)
  |> cut(Block(pos{y: y-width/2.}, .005, .01, .0) - .001) // Charger
  |> cut(/* bla bla bla */)                               // Speaker
  |> add(PhoneCase(height, width, depth))                 // Case
```
