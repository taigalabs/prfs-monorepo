"use client";

import React from "react";

import styles from "./GlobalHeader.module.scss";

const GlobalHeader: React.FC<GlobalHeaderProps> = () => {
  return <div className={styles.wrapper}></div>;
};

export default GlobalHeader;

export interface GlobalHeaderProps {}
