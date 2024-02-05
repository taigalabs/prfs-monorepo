import React from "react";
import dayjs from "dayjs";

import styles from "./LatestTimestamp.module.scss";
import { getI18N } from "@/i18n/get_i18n";
import { envs } from "@/envs";

export const isRecentlyUpdated = (() => {
  try {
    const lastDay = dayjs(envs.NEXT_PUBLIC_LAUNCH_TIMESTAMP);
    const now = dayjs();
    const d = now.diff(lastDay, "day");
    if (d <= 7) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error getting the latest Git timestamp", err);
    return true;
  }
})();

const LatestTimestamp: React.FC<LatestTimestampProps> = async () => {
  const i18n = await getI18N();

  return isRecentlyUpdated && <p className={styles.wrapper}>{i18n.new}</p>;
};

export default LatestTimestamp;

export interface LatestTimestampProps {}
