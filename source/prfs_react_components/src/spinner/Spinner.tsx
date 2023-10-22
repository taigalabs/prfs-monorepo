import React from "react";
import cn from "classnames";

import styles from "./Spinner.module.scss";

const Spinner: React.FC<SpinnerProps> = () => {
  return <div className={styles.wrapper}></div>;
};

export default Spinner;

export interface SpinnerProps {}
