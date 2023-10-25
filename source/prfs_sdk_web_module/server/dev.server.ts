import fs from "fs";
import webpack from "webpack";
import path from "path";

import { devConfig } from "../webpack.config";
import { createApp } from "./app";

const DIST_PATH = path.resolve(__dirname, "../dist/index.html");
const INDEX_HTML_PATH = path.resolve(__dirname, "../index.html");

(() => {
  console.log("Copying file, src: %s, dst: %s", INDEX_HTML_PATH, DIST_PATH);
  fs.copyFileSync(INDEX_HTML_PATH, DIST_PATH);

  const compiler = webpack(devConfig);

  console.log("Start webpack compilation, watching");
  compiler.watch({}, (err, stats) => {
    if (err) {
      console.error(err);
    }

    if (stats) {
      console.log("\nWebpack compilation");
      console.log(stats.toJson("minimal").assetsByChunkName);
    }
  });

  createApp();
})();
