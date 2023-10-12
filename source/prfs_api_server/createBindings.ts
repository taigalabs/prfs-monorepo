import path from "path";
import fs from "fs";
import chalk from "chalk";

const TS_PATH = path.resolve(__dirname, "./data/ts");
const JSON_PATH = path.resolve(__dirname, "./data/json");

function createBindings() {
  emptyJsonPath();

  const files = fs.readdirSync(TS_PATH);

  for (const file of files) {
    const filepath = path.resolve(TS_PATH, file);
    const mod = require(filepath).default;

    const str = JSON.stringify(mod, null, 2);
    const destPath = path.resolve(JSON_PATH, `${path.basename(file)}.json`);

    console.log("%s json binding, file: %s", chalk.green("Creating"), file);
    fs.writeFileSync(destPath, str);
  }
}

function emptyJsonPath() {
  console.log("Emptying json path, path: %s", JSON_PATH);

  fs.rmSync(JSON_PATH, { recursive: true, force: true });
  fs.mkdirSync(JSON_PATH);
}

createBindings();
