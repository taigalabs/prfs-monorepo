import chalk from "chalk";
import path from "path";

const paths = (() => {
  const dist = path.resolve(__dirname, "../dist");
  const workspace = path.resolve(__dirname, "../../../");
  const indexHtml = path.resolve(__dirname, "../index.html");

  const p = {
    workspace,
    dist,
    indexHtml,
  };

  console.log("%s paths, %o", chalk.green("Initialized"), p);

  return p;
})();

export default paths;
