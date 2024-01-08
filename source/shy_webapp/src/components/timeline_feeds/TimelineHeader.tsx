import React from "react";
import { ShyPost } from "@taigalabs/prfs-entities/bindings/ShyPost";

import styles from "./TimelineHeader.module.scss";

const TimelineHeader: React.FC<TimelineHeaderProps> = () => {
  return <div className={styles.wrapper}>header</div>;
};

export default TimelineHeader;

export interface TimelineHeaderProps {}
