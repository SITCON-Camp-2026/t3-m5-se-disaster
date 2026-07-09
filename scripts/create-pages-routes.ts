import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const distDir = "dist";
const indexPath = join(distDir, "index.html");
const v1Dir = join(distDir, "v1");
const v1IndexPath = join(v1Dir, "index.html");

mkdirSync(v1Dir, { recursive: true });
copyFileSync(indexPath, v1IndexPath);

console.log(`Created GitHub Pages route: ${v1IndexPath}`);
