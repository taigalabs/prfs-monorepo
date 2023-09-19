import React from "react";
import { useRouter } from "next/navigation";

import styles from "./TimelineHeader.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const TimelineHeader: React.FC<TimelineHeaderProps> = ({ channelId }) => {
  const cId = React.useMemo(() => {
    return channelId.charAt(0).toUpperCase() + channelId.slice(1);
  }, [channelId]);

  return <div className={styles.wrapper}>{cId}</div>;
};

export default TimelineHeader;

export interface TimelineHeaderProps {
  channelId: string;
}
