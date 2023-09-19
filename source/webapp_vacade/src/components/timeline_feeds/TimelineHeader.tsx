import React from "react";
import { useRouter } from "next/navigation";
import Button from "@taigalabs/prfs-react-components/src/button/Button";

import styles from "./TimelineHeader.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const TimelineHeader: React.FC<TimelineHeaderProps> = ({ channelId }) => {
  const i18n = React.useContext(i18nContext);

  const cId = React.useMemo(() => {
    return channelId.charAt(0).toUpperCase() + channelId.slice(1);
  }, [channelId]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <span>{cId}</span>
      </div>
      <div className={styles.btnRow}>
        <Button variant="white_gray_1">{i18n.post}</Button>
      </div>
    </div>
  );
};

export default TimelineHeader;

export interface TimelineHeaderProps {
  channelId: string;
}
