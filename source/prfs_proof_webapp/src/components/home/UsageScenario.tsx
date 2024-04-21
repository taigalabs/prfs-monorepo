import React from "react";
import cn from "classnames";

import styles from "./UsageScenario.module.scss";

const UsageScenario: React.FC<LogoContainerProps> = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.text}>
          What if you can use a finance app, a dating app, or a social app without having to submit
          your data while still being able to say you are undeniably eligible to use their services?
        </div>
      </div>
    </div>
  );
};

export default UsageScenario;

export interface LogoContainerProps {}

export interface IframeProps {
  src: string;
}
