import express from "express";
import cors from "cors";
import middleware from "webpack-dev-middleware";
import webpack from "webpack";
import path from "path";

import webpackConfig from "../webpack.config";

const distPath = path.resolve(__dirname, "../dist");
const PORT = 3010;

const compiler = webpack(webpackConfig);

const app = express();
app.use(cors());

app.use((_, res, next) => {
  res.set("Cross-Origin-Embedder-Policy", "require-corp");
  res.set("Cross-Origin-Opener-Policy", "same-origin");
  res.set("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

// app.use("/proof_gen", ;

app.get("/", (_, res) => {
  res.send({
    status: "Ok",
  });
});

app.post("/api", (_, res) => {
  res.send({
    status: "Ok",
  });
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
