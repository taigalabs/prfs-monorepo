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
          Universal and performant interface for building client-side zero-knowledge proofs.
          {/* <span>Create anonymous</span> */}
          {/* <br className={styles.lineBreak} /> */}
          {/* <span className={styles.proofs}>proofs</span> */}
        </div>
        <div className={styles.subtitle}>
          Universal and performant interface for building client-side zero-knowledge proofs.
        </div>
      </HomeInner>
    </div>
  );
};

export default TitleArea;

export interface LogoContainerProps {}
