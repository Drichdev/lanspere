# Explore World

An interactive landing page with a generative p5.js planet in the background and a centered looping project list. Hovering a project reveals a halftone text effect and displays its preview image in the bottom-right corner.

## Structure

```
explore-world/
  index.html    page structure
  style.css     styling and animations
  sketch.js     animated background (p5.js planet)
  projects.js   project list, halftone effect, infinite scroll
  images/       project visuals (1.png to 20.png)
```

## How it works

### Background (sketch.js)
A generative planet drawn point by point with p5.js. The `PLANET_SCALE` constant controls its overall size.

### Project list (projects.js)
Names are defined in `projectNames` and shuffled randomly on load. The list is duplicated three times to allow infinite looping scroll: when the user scrolls near the top or bottom, the scroll position is silently reset into the neighboring, identical copy, creating the illusion of an endless list.

Each name is made of two elements:
- a full-width row for stacking and centering
- an inner text element that alone responds to hover (the detection area matches the text exactly, not the whole row)

### Halftone effect
On hover, a canvas is layered over the text. It samples the letters' silhouette and redraws it as white dots with a slightly varying size, producing an animated dot-pattern effect.

### Project preview
A fixed panel in the bottom right shows the image tied to the hovered project (`images/1.png` to `images/20.png`, mapped to names in order). The panel stays anchored in place but resizes to each image's natural dimensions.

## Quick customization

| Element | File | Variable |
|---|---|---|
| Planet size | sketch.js | `PLANET_SCALE` |
| Project names | projects.js | `projectNames` |
| Linked images | projects.js | `imageUrls` |
| Text size | style.css | `.project-name` (font-size) |
| Halftone animation speed | projects.js | `this.t += 0.05` in `HalftoneName.start()` |