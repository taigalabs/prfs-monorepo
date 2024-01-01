import React, { HTMLInputTypeAttribute } from "react";
import cn from "classnames";

import styles from "./QueryItem.module.scss";

export const QueryItemList: React.FC<QueryItemProps> = ({ children }) => {
  return <div className={styles.list}>{children}</div>;
};

export const QueryItem: React.FC<QueryItemProps> = ({ children }) => {
  return <div className={styles.item}>{children}</div>;
};

export const QueryItemLeftCol: React.FC<QueryItemProps> = ({ children }) => {
  return <div className={styles.leftCol}>{children}</div>;
};

export const QueryItemRightCol: React.FC<QueryItemProps> = ({ children }) => {
  return <div className={styles.rightCol}>{children}</div>;
};

export const QueryName: React.FC<QueryItemProps> = ({ children }) => {
  return <div className={styles.name}>{children}</div>;
};

export interface QueryItemProps {
  className?: string;
  children: React.ReactNode;
}
