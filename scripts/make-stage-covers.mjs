// Builds the 2:1 project covers (public/projects/<slug>/stage.webp) on one shared "stage":
// same dark tinted backdrop, dot grid, glow and floor shadow for every project; only the
// object on the stage changes (a printed poster, a laptop, or a row of phones).
// Run: node scripts/make-stage-covers.mjs
import sharp from "sharp";
import { renameSync } from "node:fs";

sharp.cache(false);
const W = 2000;
const H = 1000;
const P = (slug, f) => `public/projects/${slug}/${f}`;

const hex = (c) => c.match(/\w\w/g).map((x) => parseInt(x, 16));
const toHex = (rgb) => "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
const mix = (a, b, t) => toHex(hex(a).map((v, i) => v * (1 - t) + hex(b)[i] * t));

function backdrop(accent) {
  const base = mix(accent, "#0e1213", 0.84);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="g" cx="50%" cy="46%" r="55%">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.42"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="d" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.6" fill="#ffffff" fill-opacity="0.07"/>
    </pattern>
    <radialGradient id="f" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#000" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="${base}"/>
  <rect width="100%" height="100%" fill="url(#d)"/>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <ellipse cx="${W / 2}" cy="${H - 70}" rx="${W * 0.36}" ry="46" fill="url(#f)"/>
</svg>`);
}

/** Soft drop shadow for a w×h rounded box; returns {input, pad}. */
function shadow(w, h, r, blur = 34, opacity = 0.5, dy = 26) {
  const pad = blur * 3;
  return {
    pad,
    dy,
    input:
      Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w + pad * 2}" height="${h + pad * 2}">
  <filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${blur}"/></filter>
  <rect x="${pad}" y="${pad}" width="${w}" height="${h}" rx="${r}" fill="#000" fill-opacity="${opacity}" filter="url(#b)"/>
</svg>`),
  };
}

async function rounded(file, w, h, r, position = "top") {
  const img = await sharp(file).resize(w, h, { fit: "cover", position }).png().toBuffer();
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" fill="#fff"/></svg>`,
  );
  return sharp(img)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

/** Places a w×h object with its shadow; returns composite layers. */
function place(buf, x, y, w, h, r, shadowOpts = {}) {
  const s = shadow(w, h, r, shadowOpts.blur, shadowOpts.opacity, shadowOpts.dy);
  return [
    { input: s.input, left: Math.round(x - s.pad), top: Math.round(y - s.pad + s.dy) },
    { input: buf, left: Math.round(x), top: Math.round(y) },
  ];
}

async function poster(file) {
  const meta = await sharp(file).metadata();
  const h = 860;
  const w = Math.round((h * meta.width) / meta.height);
  const img = await rounded(file, w, h, 6);
  return place(img, (W - w) / 2, 50, w, h, 6);
}

async function laptop(screenFile, panels) {
  const sw = 1120;
  const sh = 700;
  const bz = 20;
  const bw = sw + bz * 2;
  const bh = sh + bz * 2;
  const x = (W - bw) / 2;
  const y = 70;
  const body = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${bw}" height="${bh}">
  <rect width="${bw}" height="${bh}" rx="30" fill="#1b1f22"/>
  <rect x="1.5" y="1.5" width="${bw - 3}" height="${bh - 3}" rx="29" fill="none" stroke="#3a4146" stroke-width="3"/>
  <circle cx="${bw / 2}" cy="${bz / 2}" r="4" fill="#3a4146"/>
</svg>`);
  const baseW = 1420;
  const base = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${baseW}" height="40">
  <defs><linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d7dbde"/><stop offset="1" stop-color="#8d959b"/></linearGradient></defs>
  <path d="M0 0 H${baseW} V14 Q${baseW} 40 ${baseW - 40} 40 H40 Q0 40 0 14 Z" fill="url(#m)"/>
  <rect x="${baseW / 2 - 110}" y="0" width="220" height="10" rx="5" fill="#a3aab0"/>
</svg>`);
  const screen = await rounded(screenFile, sw, sh, 10);
  const layers = [
    ...place(body, x, y, bw, bh, 30, { blur: 40, opacity: 0.55 }),
    { input: screen, left: x + bz, top: y + bz },
    { input: base, left: (W - baseW) / 2, top: y + bh },
  ];
  for (const p of panels) {
    const meta = await sharp(p.file).metadata();
    const h = p.h ?? Math.round((p.w * meta.height) / meta.width);
    const img = await rounded(p.file, p.w, h, 16, p.position ?? "top");
    const framed = await sharp({
      create: {
        width: p.w + 8,
        height: h + 8,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        {
          input: Buffer.from(
            `<svg xmlns="http://www.w3.org/2000/svg" width="${p.w + 8}" height="${h + 8}"><rect width="${p.w + 8}" height="${h + 8}" rx="20" fill="#ffffff" fill-opacity="0.9"/></svg>`,
          ),
        },
        { input: img, left: 4, top: 4 },
      ])
      .png()
      .toBuffer();
    layers.push(
      ...place(framed, p.x, p.y, p.w + 8, h + 8, 20, { blur: 30, opacity: 0.55, dy: 22 }),
    );
  }
  return layers;
}

async function phone(file, sh, aspect) {
  const sw = Math.round(sh * aspect);
  const bz = 14;
  const w = sw + bz * 2;
  const h = sh + bz * 2;
  const screen = await rounded(file, sw, sh, 58);
  return sharp({
    create: { width: w, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      {
        input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" rx="${58 + bz}" fill="#16191b"/>
  <rect x="1.5" y="1.5" width="${w - 3}" height="${h - 3}" rx="${58 + bz - 1}" fill="none" stroke="#454c52" stroke-width="3"/>
</svg>`),
      },
      { input: screen, left: bz, top: bz },
    ])
    .png()
    .toBuffer();
}

/** Object plus its shadow on one padded transparent canvas, so both can rotate together. */
async function withShadow(buf, w, h, r, { blur = 34, opacity = 0.5, dy = 24 } = {}) {
  const s = shadow(w, h, r, blur, opacity, 0);
  const pad = s.pad;
  return sharp({
    create: {
      width: w + pad * 2,
      height: h + pad * 2 + dy,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: s.input, left: 0, top: dy },
      { input: buf, left: pad, top: pad },
    ])
    .png()
    .toBuffer();
}

async function phones(files, aspect) {
  const [l, c, r] = files;
  const clear = { r: 0, g: 0, b: 0, alpha: 0 };
  const build = async (file, sh, deg, shadowOpts) => {
    const buf = await phone(file, sh, aspect);
    const m = await sharp(buf).metadata();
    const shadowed = await withShadow(buf, m.width, m.height, 72, shadowOpts);
    return deg ? sharp(shadowed).rotate(deg, { background: clear }).png().toBuffer() : shadowed;
  };
  const layers = [];
  const cx = W / 2;
  const add = async (buf, centerX, top) => {
    const m = await sharp(buf).metadata();
    // Crop anything that falls outside the stage (only transparent shadow edges).
    const left = Math.round(centerX - m.width / 2);
    const cropTop = Math.max(0, -top);
    const h = Math.min(m.height - cropTop, H - Math.max(0, top));
    const cropped = await sharp(buf)
      .extract({ left: 0, top: cropTop, width: m.width, height: h })
      .png()
      .toBuffer();
    layers.push({ input: cropped, left, top: Math.max(0, top) });
  };
  await add(await build(l, 680, -6, { blur: 30, opacity: 0.45 }), cx - 420, 30);
  await add(await build(r, 680, 6, { blur: 30, opacity: 0.45 }), cx + 420, 30);
  await add(await build(c, 790, 0, { blur: 36, opacity: 0.6 }), cx, -70);
  return layers;
}

/** Trims a layer to the stage, since sharp rejects layers that hang over the edge. */
async function clip(layer) {
  const m = await sharp(layer.input).metadata();
  const x0 = Math.max(0, layer.left);
  const y0 = Math.max(0, layer.top);
  const x1 = Math.min(W, layer.left + m.width);
  const y1 = Math.min(H, layer.top + m.height);
  if (x0 === layer.left && y0 === layer.top && x1 - x0 === m.width && y1 - y0 === m.height)
    return layer;
  const input = await sharp(layer.input)
    .extract({ left: x0 - layer.left, top: y0 - layer.top, width: x1 - x0, height: y1 - y0 })
    .png()
    .toBuffer();
  return { input, left: x0, top: y0 };
}

async function write(slug, accent, layers) {
  const out = P(slug, "stage.webp");
  const tmp = out + ".tmp";
  await sharp(backdrop(accent))
    .composite(await Promise.all(layers.map(clip)))
    .webp({ quality: 86 })
    .toFile(tmp);
  renameSync(tmp, out);
  console.log("wrote", out);
}

const jobs = {
  async kawalbijak() {
    await write(
      "kawalbijak",
      "#e07a2f",
      await laptop(P("kawalbijak", "landingpage.webp"), [
        { file: P("kawalbijak", "dampak.webp"), x: 90, y: 500, w: 560 },
        { file: P("kawalbijak", "policy.webp"), x: 1400, y: 420, w: 500 },
      ]),
    );
  },
  async nexaorder() {
    await write(
      "nexaorder",
      "#1f8a7a",
      await laptop(P("nexaorder", "dashboard.webp"), [
        { file: P("nexaorder", "order-detail.webp"), x: 90, y: 520, w: 560 },
        { file: P("nexaorder", "reports.webp"), x: 1400, y: 430, w: 500 },
      ]),
    );
  },
  async studylens() {
    const f = ["home", "math-result", "flashcards"].map((n) => P("studylens", `${n}.webp`));
    await write("studylens", "#6d5bd0", await phones(f, 420 / 910));
  },
  async lifty() {
    const f = ["today", "camera-coach", "progress"].map((n) => P("lifty", `${n}.webp`));
    await write("lifty", "#4f6bed", await phones(f, 0.48));
  },
};
// Accent per poster, picked from each poster's main colour (white posters fool `dominant`).
const posterAccents = {
  seascope: "#1f6fb5",
  "edu-hub": "#2b5a73",
  campusconnect: "#1e8ad6",
  tourease: "#2d5bd6",
  sangkuriang: "#3f7a4a",
};
for (const [slug, accent] of Object.entries(posterAccents)) {
  jobs[slug] = async () => {
    await write(slug, accent, await poster(P(slug, "poster.webp")));
  };
}

const only = process.argv.slice(2);
for (const [slug, job] of Object.entries(jobs))
  if (!only.length || only.includes(slug)) await job();
