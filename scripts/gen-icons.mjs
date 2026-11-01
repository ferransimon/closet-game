// Genera los iconos PNG de la PWA a partir de public/icons/icon.svg
import sharp from "sharp";
import { readFile } from "node:fs/promises";

const dir = new URL("../public/icons/", import.meta.url);
const svg = await readFile(new URL("icon.svg", dir));

await sharp(svg).resize(192).png().toFile(new URL("icon-192.png", dir).pathname);
await sharp(svg).resize(512).png().toFile(new URL("icon-512.png", dir).pathname);
await sharp(svg).resize(180).flatten({ background: "#fff8f0" }).png().toFile(new URL("apple-touch-icon.png", dir).pathname);
// Maskable: icono reducido sobre fondo completo (zona segura ~80%).
const inner = await sharp(svg).resize(360).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: "#fff8f0" } })
  .composite([{ input: inner, gravity: "center" }])
  .png()
  .toFile(new URL("icon-maskable-512.png", dir).pathname);
console.log("Iconos generados");
