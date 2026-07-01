/* ---------------------------------------------------
   Donnees
--------------------------------------------------- */

const projectNames = [
  "VOLT & MARROW",
  "ASHGROVE STUDIO",
  "NIMBUS FORM",
  "QUIET ENGINE",
  "TALLOW HOUSE",
  "ORELIA LABS",
  "FERN & VAULT",
  "GREYSCALE CO",
  "HALCYON WORKS",
  "MONOLINE STUDIO",
  "SABLE & CO",
  "DUSKFIELD",
  "PARALLAX HOUSE",
  "WOVEN NORTH"
];

const imageUrls = [
  "images/1.png",
  "images/2.png",
  "images/3.png",
  "images/4.png",
  "images/5.png",
  "images/6.png",
  "images/7.png",
  "images/8.png",
  "images/9.png",
  "images/10.png",
  "images/11.png",
  "images/12.png",
  "images/13.png",
  "images/14.png",
  "images/15.png",
  "images/16.png",
  "images/17.png",
  "images/18.png",
  "images/19.png",
  "images/20.png"
];

/* melange aleatoire (Fisher-Yates) */
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ---------------------------------------------------
   Effet halftone sur un nom (canvas par-dessus le texte)
--------------------------------------------------- */

class HalftoneName {
  constructor(el) {
    this.el = el;
    this.text = el.textContent;

    this.canvas = document.createElement("canvas");
    this.canvas.className = "halftone-canvas";
    el.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    this.raf = null;
    this.t = 0;

    this.resize();

    el.addEventListener("mouseenter", () => this.start());
    el.addEventListener("mouseleave", () => this.stop());
  }

  resize() {
    const rect = this.el.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this.w = Math.max(rect.width, 1);
    this.h = Math.max(rect.height, 1);

    this.canvas.width = this.w * dpr;
    this.canvas.height = this.h * dpr;
    this.canvas.style.width = this.w + "px";
    this.canvas.style.height = this.h + "px";
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const style = getComputedStyle(this.el);

    // buffer hors ecran pour echantillonner la silhouette du texte
    const buffer = document.createElement("canvas");
    buffer.width = this.w;
    buffer.height = this.h;
    const bctx = buffer.getContext("2d");
    bctx.fillStyle = "#fff";
    bctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    bctx.textBaseline = "middle";
    bctx.textAlign = "center";
    bctx.fillText(this.text, this.w / 2, this.h / 2 + this.h * 0.06);

    this.samples = bctx.getImageData(0, 0, this.w, this.h).data;
  }

  start() {
    if (this.raf) return;
    const loop = () => {
      this.t += 0.05;
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    loop();
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = null;
    this.ctx.clearRect(0, 0, this.w, this.h);
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    const cell = 6;

    for (let y = 0; y < this.h; y += cell) {
      for (let x = 0; x < this.w; x += cell) {
        const idx = (Math.floor(y) * this.w + Math.floor(x)) * 4;
        const alpha = this.samples[idx + 3] / 255;
        if (alpha < 0.08) continue;

        const wobble = Math.sin((x + y) * 0.06 + this.t) * 0.5;
        const radius = (cell / 2 - 0.5) * alpha + wobble * 0.35;
        if (radius <= 0.3) continue;

        ctx.beginPath();
        ctx.arc(x + cell / 2, y + cell / 2, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, alpha + 0.15)})`;
        ctx.fill();
      }
    }
  }
}

/* ---------------------------------------------------
   Construction de la liste (x3 pour la boucle) + scroll infini
--------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("projectsList");
  const preview = document.getElementById("projectPreview");
  const previewImg = document.getElementById("previewImg");
  const previewCaption = document.getElementById("previewCaption");

  const order = shuffle(projectNames);

  const items = [];
  const halftones = [];

  function buildSet() {
    order.forEach((name, i) => {
      const li = document.createElement("li");
      li.className = "project-name in";
      li.textContent = name;
      list.appendChild(li);
      items.push(li);
      halftones.push(new HalftoneName(li));

      const img = imageUrls[i % imageUrls.length];

      li.addEventListener("mouseenter", () => {
        li.classList.add("active");
        previewImg.src = img;
        previewCaption.textContent = name;
        preview.classList.add("active");
      });

      li.addEventListener("mouseleave", () => {
        li.classList.remove("active");
        preview.classList.remove("active");
      });
    });
  }

  // 3 copies identiques l'une sous l'autre : ca donne la matiere
  // pour boucler sans jamais voir de "trou" ni de fin de liste
  buildSet();
  buildSet();
  buildSet();

  let setHeight = 0;

  function measure() {
    setHeight = list.scrollHeight / 3;
  }

  function centerOnMiddleSet() {
    measure();
    list.scrollTop = setHeight;
  }

  // demarre au milieu (2e copie) pour pouvoir boucler des deux cotes
  requestAnimationFrame(centerOnMiddleSet);

  list.addEventListener("scroll", () => {
    if (setHeight <= 0) return;

    // trop remonte dans la 1ere copie -> on se replace dans la 3eme
    if (list.scrollTop <= 0) {
      list.scrollTop += setHeight;
    }
    // trop descendu dans la 3eme copie -> on se replace dans la 1ere
    else if (list.scrollTop >= setHeight * 2) {
      list.scrollTop -= setHeight;
    }
  });

  window.addEventListener("resize", () => {
    const ratio = list.scrollTop / (setHeight || 1);
    measure();
    list.scrollTop = ratio * setHeight;
    halftones.forEach((h) => h.resize());
  });
});