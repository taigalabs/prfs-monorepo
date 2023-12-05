import path from "path";
import fs from "fs";

function copyAssets() {
  const srcPath = path.resolve(__dirname, "build");
  const destPath = path.resolve(__dirname, "dist/wasm_wrapper");

  fs.mkdirSync(destPath, { recursive: true });

  fs.cpSync(srcPath, destPath, { recursive: true });
}

function main() {
  copyAssets();
}

main();
