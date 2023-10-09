const express = require("express");
const app = express();
const PORT = 8080;

app.use(
  express.static("dist", {
    setHeaders: (res, _path) => {
      res.set("Cross-Origin-Embedder-Policy", "require-corp");
      res.set("Cross-Origin-Opener-Policy", "same-origin");
    },
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
