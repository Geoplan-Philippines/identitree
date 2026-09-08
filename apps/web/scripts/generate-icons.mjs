import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

/**
 * Generates the app favicon + apple-icon as square, solid-background tiles.
 *
 * The raw wing-mark assets are 2:1 and transparent, so they cannot be used
 * directly as a favicon (they render as a squished sliver and the light arc
 * vanishes on white tabs). Here we center the mark on a solid forest tile.
 *
 * Run: pnpm --filter web icons  (or: node scripts/generate-icons.mjs)
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = join(__dirname, "..", "app");
const markPath = join(__dirname, "..", "public", "assets", "wing-mark-on-ink.png");

// Brand forest — matches manifest theme_color.
const FOREST = { r: 13, g: 42, b: 31, alpha: 1 };

/** Composite the mark, scaled to `markWidth`, centered on a `size`² forest tile. */
async function buildTile(size, markWidth, outFile) {
  const mark = await sharp(markPath)
    .resize({ width: markWidth })
    .png()
    .toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: FOREST },
  })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(join(appDir, outFile));

  console.log(`✓ ${outFile} (${size}×${size})`);
}

await buildTile(512, 464, "icon.png");
await buildTile(180, 152, "apple-icon.png");
