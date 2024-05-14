import React from "react";

import styles from "./CommentComponents.module.scss";

export const CommentWrapper: React.FC<PostInnerProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export const CommentInner: React.FC<PostInnerProps> = ({ children }) => {
  return <div className={styles.inner}>{children}</div>;
};

export interface PostInnerProps {
  children?: React.ReactNode;
}
