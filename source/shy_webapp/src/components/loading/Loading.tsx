"use client";

import React from "react";
import cn from "classnames";

import styles from "./Loading.module.scss";

const Loading: React.FC<LoadingProps> = ({ children, centerAlign }) => {
  return (
    <div className={cn(styles.wrapper, { [styles.centerAlign]: centerAlign })}>
      {children ? children : "Loading..."}
    </div>
  );
};

export default Loading;

export interface LoadingProps {
  children?: React.ReactNode;
  centerAlign?: boolean;
}
