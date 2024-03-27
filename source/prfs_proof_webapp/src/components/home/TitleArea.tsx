import React from "react";
import cn from "classnames";

import styles from "./TitleArea.module.scss";
import { useI18N } from "@/i18n/use_i18n";

const TitleArea: React.FC<LogoContainerProps> = () => {
  const i18n = useI18N();

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <span>Create anonymous</span>
        <br className={styles.lineBreak} />
        <span className={styles.proofs}>proofs</span>
      </div>
      <div className={styles.subtitle}>
        Universal and performant interface for building client-side zero-knowledge proofs.
      </div>
    </div>
  );
};

export default TitleArea;

export interface LogoContainerProps {}