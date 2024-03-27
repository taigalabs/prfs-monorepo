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
    <Area>
      <Title>{i18n.features_for_safer_internet}</Title>
      <ul className={styles.itemContainer}>
        <li className={styles.item}>
          <p>
            <TbMathPi />
            {i18n.proof}
          </p>
          <p>Create and proof zero-knowledge proofs on your machine.</p>
        </li>
        <li className={styles.item}>
          <p>
            <TbCertificate />
            {i18n.attestation}
          </p>
          <p>
            Attest to your data to streamline the process of generating the proof and to enable{" "}
          </p>
        </li>
      </ul>
    </Area>
  );
};

export default FeatureList;

export interface LogoContainerProps {}
