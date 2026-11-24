// One-off helper: renders certificate PDFs (page 1) to WebP images for the site.
// Usage: node scripts/render-certificates.mjs <input.pdf> <output.webp> [...pairs]
import { readFileSync, writeFileSync } from "node:fs";
import { createCanvas } from "@napi-rs/canvas";
import sharp from "sharp";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const args = process.argv.slice(2);
for (let i = 0; i < args.length; i += 2) {
  const [input, output] = [args[i], args[i + 1]];
  const pdf = await getDocument({ data: new Uint8Array(readFileSync(input)), disableFontFace: true }).promise;
  const page = await pdf.getPage(1);
  const base = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale: 2000 / base.width });
  const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height));
  await page.render({ canvasContext: canvas.getContext("2d"), viewport, canvas }).promise;
  const png = await canvas.encode("png");
  const out = await sharp(png).resize({ width: 1600 }).webp({ quality: 82 }).toBuffer({ resolveWithObject: true });
  writeFileSync(output, out.data);
  console.log(output, `${out.info.width}x${out.info.height}`, Math.round(out.info.size / 1024) + "KB");
}
