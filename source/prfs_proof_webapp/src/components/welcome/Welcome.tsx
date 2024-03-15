"use client";

import React from "react";
import cn from "classnames";

import styles from "./Welcome.module.scss";
import Content from "./Welcome.mdx";

const Welcome: React.FC<WelcomeProps> = ({}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <Content />
      </div>
    </div>
  );
};

export default Welcome;

export interface WelcomeProps {}
