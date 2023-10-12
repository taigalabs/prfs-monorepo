import React from "react";
import Link from "next/link";

import styles from "./LatestTimestamp.module.scss";
import { i18nContext } from "@/contexts/i18n";

const LatestTimestamp: React.FC<LatestTimestampProps> = () => {
  return <span className={styles.wrapper}>({process.env.NEXT_PUBLIC_UPDATE_TIMESTAMP})</span>;
};

export default LatestTimestamp;

export interface LatestTimestampProps {}
