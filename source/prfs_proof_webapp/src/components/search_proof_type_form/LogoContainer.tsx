import React from "react";
import ImageLogo from "@taigalabs/prfs-react-lib/src/image_logo/ImageLogo";
import cn from "classnames";

import styles from "./LogoContainer.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { inter } from "@/fonts";

const LogoContainer: React.FC<LogoContainerProps> = ({ proofTypeChosen }) => {
  const i18n = useI18N();

  return (
    <div
      className={cn(styles.wrapper, inter.className, { [styles.proofTypeChosen]: proofTypeChosen })}
    >
      <div className={styles.text}>
        <span>Create anonymous</span>
        <br className={styles.lineBreak} />
        <span className={styles.proofs}>proofs</span>
      </div>
      <div>Prfs is a generic interface</div>
    </div>
  );
};

export default LogoContainer;

export interface LogoContainerProps {
  proofTypeChosen: boolean;
}
