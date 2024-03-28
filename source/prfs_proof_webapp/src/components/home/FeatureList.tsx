import React from "react";
import cn from "classnames";
import { MdArrowForward } from "@react-icons/all-files/md/MdArrowForward";
import { MdArrowUpward } from "@react-icons/all-files/md/MdArrowUpward";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";
import { TbCertificate } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbCertificate";
import { TbMathPi } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbMathPi";
import Link from "next/link";

import styles from "./FeatureList.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { urls } from "@/urls";
import { paths } from "@/paths";
import { Area, Title } from "./IntroComponents";

const FeatureList: React.FC<LogoContainerProps> = ({ handleFocusSearchBar }) => {
  const i18n = useI18N();

  return (
    <Area className={styles.wrapper}>
      {/* <Title>{i18n.features_for_safer_internet}</Title> */}
      <ul className={styles.itemContainer}>
        <li className={cn(styles.item, styles.proof)}>
          <div className={styles.title}>
            <p className={styles.iconBox}>
              <TbMathPi />
            </p>
            {i18n.proof}
          </div>
          <p className={styles.desc}>Create and verify zero-knowledge proofs on your browser.</p>
          <p className={styles.callToAction} onClick={handleFocusSearchBar}>
            Find proof type
            <MdArrowUpward />
          </p>
        </li>
        <li className={cn(styles.item, styles.attestation)}>
          <div className={styles.title}>
            <p className={styles.iconBox}>
              <TbCertificate />
            </p>
            {i18n.attestation}
          </div>
          <p className={styles.desc}>
            Attest to your data to streamline the process of generating the proof and to claim
            diverse fact about you
          </p>
          <p className={styles.callToAction}>
            <Link href={paths.attestations}>
              Learn more
              <MdArrowForward />
            </Link>
          </p>
        </li>
      </ul>
    </Area>
  );
};

export default FeatureList;

export interface LogoContainerProps {
  handleFocusSearchBar: () => void;
}
