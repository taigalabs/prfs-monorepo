import React from "react";

import styles from "./TimelineHeader.module.scss";
import ShyLogo from "@/components/shy_logo/ShyLogo";
import MyAvatar from "../my_avatar/MyAvatar";
import { LocalShyCredential } from "@/storage/local_storage";

const TimelineHeader: React.FC<TimelineHeaderProps> = ({ credential }) => {
  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        <li>
          <MyAvatar credential={credential} />
        </li>
        <li className={styles.logo}>
          <ShyLogo width={60} />
        </li>
        <li />
      </ul>
    </div>
  );
};

export default TimelineHeader;

export interface TimelineHeaderProps {
  credential: LocalShyCredential;
}
