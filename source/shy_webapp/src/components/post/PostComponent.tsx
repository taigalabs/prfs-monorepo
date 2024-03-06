import React from "react";

import styles from "./PostComponent.module.scss";

export const PostInner: React.FC<PostInnerProps> = ({ children }) => {
  return <div className={styles.postInner}>{children}</div>;
};

export interface PostInnerProps {
  children?: React.ReactNode;
}
