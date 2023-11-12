import simpleGit from "simple-git";

import paths from "./paths";

export default async function getGitLog() {
  const git = simpleGit(paths.workspace);

  const log = await git.log();

  return log.latest?.hash;
}
