import express from "express";
import cors from "cors";

const PORT = 3010;

const app = express();

app.use(cors());

app.use((_, res, next) => {
  res.set("Cross-Origin-Embedder-Policy", "require-corp");
  res.set("Cross-Origin-Opener-Policy", "same-origin");
  res.set("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

app.use("/proof_gen", express.static("dist"));

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
