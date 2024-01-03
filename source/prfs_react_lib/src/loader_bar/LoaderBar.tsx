import React from "react";
import cn from "classnames";

import styles from "./LoaderBar.module.scss";

const LoaderBar: React.FC<LoaderBarProps> = ({ className }) => {
  return <div className={cn(styles.loader, className)} />;
};

export default LoaderBar;

export interface LoaderBarProps {
  className?: string;
}
