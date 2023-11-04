import fs from "fs";
import webpack from "webpack";

import devConfig from "../webpack/dev.config";
import { createApp } from "./app";
import paths from "./paths";

(async () => {
  console.log("Copying file, src: %s, dst: %s", paths.indexHtml, paths.dist);
  fs.copyFileSync(paths.indexHtml, paths.dist);

  console.log("webpack dev config: %j", devConfig);

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
