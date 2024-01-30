import React from "react";
import dayjs from "dayjs";

import styles from "./LatestTimestamp.module.scss";
import { getI18N } from "@/i18n/get_i18n";

export const isRecentlyUpdated = (() => {
  const lastDay = dayjs(process.env.NEXT_PUBLIC_UPDATE_TIMESTAMP);
  const now = dayjs();
  const d = now.diff(lastDay, "day");
  if (d <= 7) {
    return true;
  } else {
    return false;
  }
})();

const LatestTimestamp: React.FC<LatestTimestampProps> = async () => {
  const i18n = await getI18N();

  return isRecentlyUpdated && <p className={styles.wrapper}>{i18n.new}</p>;
};

export default LatestTimestamp;

export interface LatestTimestampProps {}
