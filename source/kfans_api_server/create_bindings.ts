import path from "path";
import fs from "fs";
import chalk from "chalk";
import JSONBig from "json-bigint";

const TS_PATH = path.resolve(__dirname, "./data_seed/ts");
const JSON_PATH = path.resolve(__dirname, "./data_seed/json_bindings");

function createBindings() {
  emptyJsonPath();

  const files = fs.readdirSync(TS_PATH);

  for (const file of files) {
    const filepath = path.resolve(TS_PATH, file);
    const mod = require(filepath).default;

    const str = JSONBig.stringify(mod, null, 2) + "\n";
    const destPath = path.resolve(JSON_PATH, `${path.parse(file).name}.json`);

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
