/*
 * Build-time index of image sizes.
 *
 * Photos must be shown at their own aspect ratio so the whole dish is visible,
 * but the CMS lets the restaurant upload new photos without filling in any
 * dimensions. This script reads the JPEG headers of every file in
 * public/images and writes src/content/image-dimensions.json. npm runs it
 * automatically before `build`, so newly uploaded photos are picked up on the
 * next deploy with no manual step.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const imageDir = path.join(root, "public", "images");
const output = path.join(
  root,
  "src",
  "content",
  "image-dimensions.json",
);

/* Return the width and height from a JPEG's SOF marker, or null if this isn't
   a JPEG we can read. */
function jpegSize(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return null;
  }

  let offset = 2;
  while (offset < buffer.length - 9) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    // Standalone markers have no length field.
    if (
      marker === 0x01 ||
      marker === 0xd8 ||
      (marker >= 0xd0 && marker <= 0xd7)
    ) {
      offset += 2;
      continue;
    }
    const length = buffer.readUInt16BE(offset + 2);
    if (length < 2) return null;

    const isStartOfFrame =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);
    if (isStartOfFrame) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + length;
  }
  return null;
}

const result = {};
for (const name of fs.readdirSync(imageDir).sort()) {
  if (!/\.(jpe?g)$/i.test(name)) continue;
  const size = jpegSize(fs.readFileSync(path.join(imageDir, name)));
  if (size) result[`/images/${name}`] = size;
}

fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
console.log(`Image dimensions indexed: ${Object.keys(result).length}`);
