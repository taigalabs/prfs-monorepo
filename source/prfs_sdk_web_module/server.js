const express = require("express");
const app = express();
const cors = require("cors");

const PORT = 3010;

app.use(cors());

app.use((req, res, next) => {
  res.set("Cross-Origin-Embedder-Policy", "require-corp");
  res.set("Cross-Origin-Opener-Policy", "same-origin");
  res.set("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

app.use("/proof_gen", express.static("dist"));

app.get("/", (req, res) => {
  res.send({
    status: "Ok",
  });
});

app.post("/api", (req, res) => {
  res.send({
    status: "Ok",
  });
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
