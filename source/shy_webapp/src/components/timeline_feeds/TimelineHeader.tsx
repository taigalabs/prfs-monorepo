import React from "react";
import { ShyPost } from "@taigalabs/prfs-entities/bindings/ShyPost";

import styles from "./TimelineHeader.module.scss";
import ShyLogo from "@/components/shy_logo/ShyLogo";

const TimelineHeader: React.FC<TimelineHeaderProps> = () => {
  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        <li>drawer ubtton</li>
        <li>
          <ShyLogo />
        </li>
        <li>l</li>
      </ul>
    </div>
  );
};

export default TimelineHeader;

export interface TimelineHeaderProps {}
