import React from "react";
import cn from "classnames";
import { FaArrowRight } from "@react-icons/all-files/fa/FaArrowRight";
import { MdArrowForward } from "@react-icons/all-files/md/MdArrowForward";

import styles from "./CallToAction.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";

const CallToAction: React.FC<LogoContainerProps> = () => {
  const i18n = useI18N();

  return (
    <div className={styles.wrapper}>
      <p className={styles.item}>
        <HoverableText>
          <span>{i18n.read_the_docs}</span>
          <MdArrowForward />
        </HoverableText>
      </p>
      <p className={styles.item}>{i18n.or}</p>
      <p className={cn(styles.item, styles.brownBtn)}>{i18n.start_with_attestation}</p>
    </div>
  );
};

export default CallToAction;

export interface LogoContainerProps {}
