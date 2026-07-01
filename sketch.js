let counter = 100;

const PLANET_SCALE = 1.55;

function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(255);
  noFill();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0, 35);

  counter += 0.015;

  const cx = width / 2;
  const cy = height / 2;

  // planète
  for (let i = 3000; i >= 2; i -= 2) {
    drawPoints(i, 0, cx, cy);
  }

  // anneaux
  for (let i = 1999; i > 1; i -= 2) {
    drawPoints(i, 1, cx, cy);
  }
}

function drawPoints(i, parity, cx, cy) {
  let r =
    (counter / cos(counter / i) +
      parity * (counter / 2 + (i % counter))) *
    PLANET_SCALE;

  let a = counter / 9 + i * i;

  let ringFlatten = parity ? 0.28 : 1;
  let ringTilt = parity ? 2.1 : 1;

  let x = cx + r * sin(a) * cos((!parity) * i / counter);
  let y = cy + r * cos(a + parity * 2) * ringFlatten * ringTilt;

  let size = 1 - cos(a);

  if (parity) {
    let depth = sin(a + 2);
    size *= map(depth, -1, 1, 0.4, 1.3);
  }

  strokeWeight(size);

  if (parity === 0) {
    stroke(220, 200, 170, 180);
  } else {
    stroke(180, 220, 255, 140);
  }

  point(x, y);
}