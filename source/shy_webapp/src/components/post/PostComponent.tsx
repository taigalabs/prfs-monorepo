import React from "react";

import styles from "./PostComponent.module.scss";

export const PostWrapper: React.FC<PostInnerProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export const PostInner: React.FC<PostInnerProps> = ({ children }) => {
  return <div className={styles.inner}>{children}</div>;
};

export interface PostInnerProps {
  children?: React.ReactNode;
}
