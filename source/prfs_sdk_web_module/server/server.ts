import path from "path";

import { createApp } from "./app";

const distPath = path.resolve(__dirname, "../dist");

(() => {
  console.log("distPath", distPath);

  createApp();
})();
