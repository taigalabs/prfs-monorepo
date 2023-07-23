import React from "react";
import Link from "next/link";
import classnames from "classnames";

import styles from "./CardRow.module.scss";

const CardRow: React.FC<CardRowProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default CardRow;

export interface CardRowProps {
  children?: React.ReactNode;
}
