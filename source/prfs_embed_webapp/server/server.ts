import dayjs from "dayjs";

import { createApp } from "./app";
import getGitLog from "./git";

(async () => {
  const commit_hash = await getGitLog();
  const now = dayjs().toJSON();

  createApp({
    commit_hash,
    launch_time: now,
  });
})();
