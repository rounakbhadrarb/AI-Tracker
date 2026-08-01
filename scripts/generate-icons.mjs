import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "icons");

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgba) {
  const stride = width * 4 + 1;
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0;
    rgba.copy(raw, y * stride + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const lerp = (a, b, t) => a + (b - a) * t;

function pointInPolygon(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

const BOLT = [
  [0.6, 0.14],
  [0.3, 0.55],
  [0.47, 0.55],
  [0.39, 0.88],
  [0.71, 0.45],
  [0.54, 0.45],
  [0.65, 0.14],
];

function drawIcon(size, maskable) {
  const buf = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;
  const pad = maskable ? size * 0.18 : size * 0.08;
  const corner = size * 0.22;
  const inner = size - pad * 2;
  const ringOuter = inner * 0.5;
  const ringInner = inner * 0.42;

  const put = (i, r, g, b, a) => {
    buf[i] = r;
    buf[i + 1] = g;
    buf[i + 2] = b;
    buf[i + 3] = a;
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;

      let inShape = true;
      if (!maskable) {
        const dx = Math.max(corner - x, x - (size - corner), 0);
        const dy = Math.max(corner - y, y - (size - corner), 0);
        inShape = Math.hypot(dx, dy) <= corner;
      }
      if (!inShape) {
        put(i, 0, 0, 0, 0);
        continue;
      }

      const t = (x / size) * 0.5 + (y / size) * 0.5;
      let r, g, b;
      if (t < 0.5) {
        const k = t / 0.5;
        r = lerp(79, 139, k);
        g = lerp(70, 92, k);
        b = lerp(229, 246, k);
      } else {
        const k = (t - 0.5) / 0.5;
        r = lerp(139, 34, k);
        g = lerp(92, 211, k);
        b = lerp(246, 238, k);
      }

      const d = Math.hypot(x - cx, y - cy) / (size / 2);
      const v = 1 - 0.2 * d * d;
      r *= v;
      g *= v;
      b *= v;

      const dist = Math.hypot(x - cx, y - cy);
      const ang = Math.atan2(y - cy, x - cx);
      const gap = ang > -Math.PI / 2 && ang < -Math.PI / 9;
      if (dist <= ringOuter && dist >= ringInner && !gap) {
        put(i, 255, 255, 255, 250);
        continue;
      }

      const u = (x - pad) / inner;
      const w = (y - pad) / inner;
      if (pointInPolygon(u, w, BOLT)) {
        put(i, 255, 255, 255, 255);
        continue;
      }

      put(i, Math.round(r), Math.round(g), Math.round(b), 255);
    }
  }
  return encodePng(size, size, buf);
}

mkdirSync(OUT, { recursive: true });

const targets = [
  ["icon-192.png", 192, false],
  ["icon-512.png", 512, false],
  ["apple-touch-icon.png", 180, false],
  ["maskable-512.png", 512, true],
];

for (const [name, size, maskable] of targets) {
  writeFileSync(join(OUT, name), drawIcon(size, maskable));
  console.log("wrote " + name + " " + size + "x" + size);
}
