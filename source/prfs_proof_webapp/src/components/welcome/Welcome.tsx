"use client";

import React from "react";
import cn from "classnames";

import styles from "./Welcome.module.scss";

const Welcome: React.FC<WelcomeProps> = ({}) => {
  return <div className={styles.wrapper}>welcome</div>;
};

export default Welcome;

export interface WelcomeProps {}
