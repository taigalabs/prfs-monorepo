import React from "react";
import ImageLogo from "@taigalabs/prfs-react-lib/src/image_logo/ImageLogo";
import cn from "classnames";
import { inter } from "@taigalabs/prfs-react-lib/src/fonts";

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
        Universal and performant interface for enabling client-side zero-knowledge proof.
      </div>
    </div>
  );
};

export default TitleArea;

export interface LogoContainerProps {}
