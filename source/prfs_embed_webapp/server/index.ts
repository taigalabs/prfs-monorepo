import dayjs from "dayjs";

import { createApp } from "./express";

(async () => {
  const now = dayjs().toJSON();

  createApp({
    launch_time: now,
  });
})();
