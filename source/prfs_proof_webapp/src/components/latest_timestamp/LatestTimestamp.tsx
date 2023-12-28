import React from "react";
import dayjs from "dayjs";

import styles from "./LatestTimestamp.module.scss";
import { getI18N } from "@/i18n/get_i18n";
import { isRecentlyUpdated } from "@/project/timestamp";

// async function getIsRecentlyUpdated() {
// try {
//   const data = await fetch(`${envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}/api`);
//   const json = await data.json();
//   return json;
// } catch (err) {
//   console.error(`Error fetching i18n, ${err}`);
//   return en;
// }
// }

const LatestTimestamp: React.FC<LatestTimestampProps> = async () => {
  const i18n = await getI18N();

  // const isRecentlyUpdated = React.useMemo(() => {
  //   const lastDay = dayjs(process.env.NEXT_PUBLIC_UPDATE_TIMESTAMP);
  //   const now = dayjs();
  //   const d = now.diff(lastDay, "day");

  //   if (d <= 7) {
  //     return true;
  //   }
  // }, []);

  return isRecentlyUpdated && <p className={styles.wrapper}>{i18n.new}</p>;
};

export default LatestTimestamp;

export interface LatestTimestampProps {}
