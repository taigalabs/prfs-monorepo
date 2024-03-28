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
import { Area, Subtitle, Title } from "./IntroComponents";

const FeaturedApps: React.FC<LogoContainerProps> = () => {
  const i18n = useI18N();

  return (
    <Area className={styles.wrapper}>
      <Subtitle>Featured applications</Subtitle>
      <ul className={styles.itemContainer}>
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
          <div className={styles.callToAction}>
            <p>
              <Link href={paths.attestations}>
                Learn more
                <MdArrowForward />
              </Link>
            </p>
          </div>
        </li>
      </ul>
    </Area>
  );
};

export default FeaturedApps;

export interface LogoContainerProps {}
