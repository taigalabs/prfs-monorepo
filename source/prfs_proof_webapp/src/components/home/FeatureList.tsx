import React from "react";
import cn from "classnames";
import { MdArrowForward } from "@react-icons/all-files/md/MdArrowForward";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";
import { TbCertificate } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbCertificate";
import { TbMathPi } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbMathPi";
import Link from "next/link";

import styles from "./FeatureList.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { urls } from "@/urls";
import { paths } from "@/paths";
import { Area, Title } from "./IntroComponents";

const FeatureList: React.FC<LogoContainerProps> = () => {
  const i18n = useI18N();

  return (
    <Area className={styles.wrapper}>
      {/* <Title>{i18n.features_for_safer_internet}</Title> */}
      <ul className={styles.itemContainer}>
        <li className={styles.item}>
          <div className={styles.title}>
            <p className={styles.iconBox}>
              <TbMathPi />
            </p>
            {i18n.proof}
          </div>
          <p className={styles.desc}>Create and verify zero-knowledge proofs on your browser.</p>
        </li>
        <li className={styles.item}>
          <div className={styles.title}>
            <p className={cn(styles.iconBox, styles.attestation)}>
              <TbCertificate />
            </p>
            {i18n.attestation}
          </div>
          <p className={styles.desc}>
            Attest to your data to streamline the process of generating the proof and to claim
            diverse fact about you
          </p>
        </li>
      </ul>
    </Area>
  );
};

export default FeatureList;

export interface LogoContainerProps {}
