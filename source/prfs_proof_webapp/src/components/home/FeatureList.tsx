import React from "react";
import cn from "classnames";
import { MdArrowForward } from "@react-icons/all-files/md/MdArrowForward";
import { MdArrowUpward } from "@react-icons/all-files/md/MdArrowUpward";
import { FaMobileAlt } from "@react-icons/all-files/fa/FaMobileAlt";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";
import { TbCertificate } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbCertificate";
import { TbMathFunction } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbMathFunction";
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
    <div className={styles.wrapper}>
      <div className={cn(styles.item, styles.gray)}>
        <div className={styles.box}>
          <img
            className={styles.image}
            src="https://d1w1533jipmvi2.cloudfront.net/prfs_proof_example_1.png"
            crossOrigin="anonymous"
            alt="Proof example"
          />
          <div className={styles.itemContent}>
            <div className={styles.title}>
              <p className={styles.iconBox}>
                <TbMathPi />
              </p>
              {i18n.proof}
            </div>
            <p className={styles.desc}>Create and verify zero-knowledge proofs on your browser.</p>
            <div className={styles.callToAction}>
              <p onClick={handleFocusSearchBar}>
                Find proof type
                <MdArrowUpward />
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.box}>
          <img
            className={cn(styles.image, {})}
            src="https://d1w1533jipmvi2.cloudfront.net/prfs_atst_example_1.png"
            crossOrigin="anonymous"
            alt="Prfs attestation example"
          />
          <div className={styles.itemContent}>
            <div className={styles.title}>
              <p className={styles.iconBox}>
                <TbCertificate />
              </p>
              {i18n.attestation}
            </div>
            <p className={styles.desc}>Attest to your data to create a anonymous claim about</p>
            <div className={styles.callToAction}>
              <p>
                <Link href={paths.attestations}>
                  Learn more
                  <MdArrowForward />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={cn(styles.item, styles.gray)}>
        <div className={styles.box}>
          <img
            className={cn(styles.image, {})}
            src="https://d1w1533jipmvi2.cloudfront.net/prfs_id_example_1.png"
            crossOrigin="anonymous"
            alt="Prfs Id example"
          />
          <div className={styles.itemContent}>
            <div className={styles.title}>
              <p className={styles.iconBox}>
                <FaMobileAlt />
              </p>
              {i18n.prfs_id}
            </div>
            <p className={styles.desc}>Conduct cryptographic operations on your own device</p>
            <div className={styles.callToAction}>
              {/* <p> */}
              {/*   <Link href={paths.attestations}> */}
              {/*     Learn more */}
              {/*     <MdArrowForward /> */}
              {/*   </Link> */}
              {/* </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureList;

export interface LogoContainerProps {
  handleFocusSearchBar: () => void;
}
