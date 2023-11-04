import fs from "fs";
import webpack from "webpack";
import dayjs from "dayjs";

import devConfig from "../webpack/dev.config";
import { createApp } from "./app";
import paths from "./paths";
import getGitLog from "./git";

(async () => {
  const destPath = `${paths.dist}/index.html`;
  console.log("Copying file, src: %s, dst: %s", paths.indexHtml, destPath);
  fs.copyFileSync(paths.indexHtml, destPath);

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

  const commit_hash = await getGitLog();
  const now = dayjs().toJSON();

  createApp({ commit_hash, launch_time: now });
})();
