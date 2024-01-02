import React from "react";
import cn from "classnames";

import styles from "./QueryItem.module.scss";

export const QueryItemList: React.FC<QueryItemProps> = ({ children }) => {
  return <ul className={styles.list}>{children}</ul>;
};

export const QueryItem: React.FC<QueryItemProps> = ({ children, sidePadding }) => {
  return <li className={cn(styles.item, { [styles.sidePadding]: sidePadding })}>{children}</li>;
};

export const QueryItemMeta: React.FC<QueryItemProps> = ({ children }) => {
  return <div className={styles.meta}>{children}</div>;
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
  sidePadding?: boolean;
  children: React.ReactNode;
}
