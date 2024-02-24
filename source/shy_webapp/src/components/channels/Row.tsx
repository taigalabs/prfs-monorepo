import React from "react";
import { ShyChannel } from "@taigalabs/shy-entities/bindings/ShyChannel";

import styles from "./Row.module.scss";

const Row: React.FC<RowProps> = ({ channel }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
        <span className={styles.label}>{channel.label}</span>
        <span className={styles.locale}>{channel.locale}</span>
      </div>
      <div className={styles.desc}>{channel.desc}</div>
    </div>
  );
};

export default Row;

export interface RowProps {
  channel: ShyChannel;
}
