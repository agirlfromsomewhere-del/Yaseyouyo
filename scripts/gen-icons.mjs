import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const svg = readFileSync(new URL('../public/icon.svg', import.meta.url));
const outPath = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url));

await sharp(svg).resize(192, 192).png().toFile(outPath('icon-192.png'));
await sharp(svg).resize(512, 512).png().toFile(outPath('icon-512.png'));
await sharp(svg).resize(180, 180).flatten({ background: '#12141a' }).png().toFile(
  outPath('apple-touch-icon.png')
);

console.log('Icons generated.');
