import dayjs from "dayjs";

import { createApp } from "./app";

(async () => {
  const now = dayjs().toJSON();

  createApp({
    launch_time: now,
  });
})();
