import webpack from "webpack";
// import path from "path";

import webpackConfig from "../webpack.config";
import { createApp } from "./app";

const compiler = webpack(webpackConfig);

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
