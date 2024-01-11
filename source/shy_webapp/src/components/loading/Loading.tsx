"use client";

import React from "react";

import styles from "./Loading.module.scss";

const Loading: React.FC<LoadingProps> = () => {
  return <div className={styles.wrapper}>Loading...</div>;
};

export default Loading;

export interface LoadingProps {}
