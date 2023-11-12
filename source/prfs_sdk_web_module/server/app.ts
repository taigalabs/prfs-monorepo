import express from "express";
import cors from "cors";

import paths from "./paths";

const PORT = 3010;

export async function createApp(args: CreateAppArgs) {
  console.log("Create express app, args: %o", args);
  const { commit_hash, launch_time } = args;

  const app = express();

  app.use(cors());

  app.use((_, res, next) => {
    res.set("Cross-Origin-Embedder-Policy", "require-corp");
    res.set("Cross-Origin-Opener-Policy", "same-origin");
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  });

  app.use("/proof_gen", express.static(paths.dist));

  app.get("/", (_, res) => {
    res.send({
      status: "Ok",
      commit_hash,
      launch_time,
    });
  });

  app.post("/api", (_, res) => {
    res.send({
      status: "Ok",
    });
  });

  app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

  return app;
}

export interface CreateAppArgs {
  commit_hash: string | undefined;
  launch_time: string;
}
