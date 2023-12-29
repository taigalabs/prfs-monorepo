import express from "express";
import cors from "cors";

import paths from "./paths";

const PORT = 3012;

export async function createApp(args: CreateAppArgs) {
  console.log("Create express app, args: %o", args);
  const { commit_hash, launch_time } = args;

  const app = express();

  app.use((req, _, next) => {
    console.log(req.method, decodeURI(req.url));
    next();
  });

  app.use(cors());

  app.use((_, res, next) => {
    res.set("Cross-Origin-Embedder-Policy", "require-corp");
    res.set("Cross-Origin-Opener-Policy", "same-origin");
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  });

  app.use("/", express.static(paths.dist));

  app.get("/status", (_, res) => {
    res.send({
      status: "Ok",
      commit_hash,
      launch_time,
    });
  });

  app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

  return app;
}

export interface CreateAppArgs {
  commit_hash: string | undefined;
  launch_time: string;
}
