import React from "react";
import Link from "next/link";
import classnames from "classnames";

import styles from "./Card.module.scss";

const Card: React.FC<CardProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default Card;

export interface CardProps {
  children?: React.ReactNode;
}
