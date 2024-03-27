import React from "react";
import cn from "classnames";
import { MdArrowForward } from "@react-icons/all-files/md/MdArrowForward";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";
import Link from "next/link";

import styles from "./CallToAction.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { urls } from "@/urls";
import { paths } from "@/paths";

const CallToAction: React.FC<LogoContainerProps> = () => {
  const i18n = useI18N();

  return (
    <div className={styles.wrapper}>
      <p className={styles.item}>
        <button className={styles.transparentBtn} type="button">
          <HoverableText>
            <a href={urls.docs}>
              <span>{i18n.read_the_docs} (in-progress)</span>
              <MdArrowForward />
            </a>
          </HoverableText>
        </button>
        <span className={styles.or}>{i18n.or}</span>
      </p>
      <p className={styles.item}>
        <button className={styles.brownBtn} type="button">
          <Link href={paths.attestations}>{i18n.start_with_attestation}</Link>
        </button>
      </p>
    </div>
  );
};

export default CallToAction;

export interface LogoContainerProps {}
