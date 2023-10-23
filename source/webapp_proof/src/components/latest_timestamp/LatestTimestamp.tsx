import React from "react";
import Link from "next/link";
import dayjs from "dayjs";

import styles from "./LatestTimestamp.module.scss";
import { i18nContext } from "@/contexts/i18n";

const LatestTimestamp: React.FC<LatestTimestampProps> = () => {
  const i18n = React.useContext(i18nContext);

  const isRecentlyUpdated = React.useMemo(() => {
    const lastDay = dayjs(process.env.NEXT_PUBLIC_UPDATE_TIMESTAMP);
    const now = dayjs();
    const d = now.diff(lastDay, "day");

    if (d <= 7) {
      return true;
    }
  }, []);

  return isRecentlyUpdated && <p className={styles.wrapper}>{i18n.new}</p>;
};

export default LatestTimestamp;

export interface LatestTimestampProps {}
