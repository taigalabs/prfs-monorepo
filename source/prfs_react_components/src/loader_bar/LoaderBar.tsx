import React from "react";
import cn from "classnames";

import styles from "./LoaderBar.module.scss";

const LoaderBar: React.FC<LoaderBarProps> = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.loader}></div>;
    </div>
  );
};

export default LoaderBar;

export interface LoaderBarProps {}
