// Gera ícones raster (PNG) a partir de public/icon.svg.
// Uso: node scripts/generate-icons.mjs
// Requisito: devDependency "sharp".
// O logo-fonte pode ser trocado depois: basta substituir public/icon.svg
// por uma arte quadrada de alta resolução e rodar de novo.
import sharp from "sharp";
import { mkdirSync } from "fs";

const SRC = "public/icon.svg";
mkdirSync("public/icons", { recursive: true });

const targets = [
  { size: 192, out: "public/icons/icon-192.png" },
  { size: 512, out: "public/icons/icon-512.png" },
  { size: 512, out: "public/icons/icon-maskable-512.png" }, // fundo full-bleed já serve como maskable
  { size: 180, out: "public/apple-touch-icon.png" },        // iOS (sem transparência)
];

for (const { size, out } of targets) {
  await sharp(SRC, { density: 512 })
    .resize(size, size, { fit: "cover" })
    .flatten({ background: "#1A5FCC" }) // sem transparência (exigência iOS)
    .png()
    .toFile(out);
  console.log("✓ gerado", out);
}
console.log("Ícones gerados.");
