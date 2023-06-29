const express = require("express");
const port = 4000;
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());

app.use(express.static("dist"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
