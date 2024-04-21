import React from "react";
import cn from "classnames";

import styles from "./TitleArea.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { HomeInner } from "./HomeComponents";

const TitleArea: React.FC<LogoContainerProps> = () => {
  return (
    <div className={styles.wrapper}>
      <HomeInner>
        <div className={styles.title}>
          General-purpose client-side <br />
          zk-proof interface
        </div>
        <div className={styles.subtitle}>
          Data attestation, cryptographic preprocessing, and proof-spec publishing in one place.
          Designed for apps and individuals that need to collect or create anonymous proof.
        </div>
      </HomeInner>
    </div>
  );
};

export default TitleArea;

export interface LogoContainerProps {}
