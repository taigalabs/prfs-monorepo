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

const FEAT_COUNT = 3;

enum HighlightedFeature {
  PrfsProof = 0,
  PrfsAtst,
  PrfsId,
}

const FeatureList: React.FC<LogoContainerProps> = ({ handleFocusSearchBar }) => {
  const i18n = useI18N();
  const [highlightedFeature, setHighlightedFeature] = React.useState(HighlightedFeature.PrfsProof);

  React.useEffect(() => {
    const interval = window.setInterval(() => {
      setHighlightedFeature(i => (i + 1) % FEAT_COUNT);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [setHighlightedFeature]);

  return (
    <>
      <ul className={styles.itemContainer}>
        <li
          className={cn(styles.item, styles.proof, {
            [styles.isHighlighted]: highlightedFeature === HighlightedFeature.PrfsProof,
          })}
        >
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
        </li>
        <li
          className={cn(styles.item, styles.attestation, {
            [styles.isHighlighted]: highlightedFeature === HighlightedFeature.PrfsAtst,
          })}
        >
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
        </li>
        <li
          className={cn(styles.item, styles.prfsId, {
            [styles.isHighlighted]: highlightedFeature === HighlightedFeature.PrfsId,
          })}
        >
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
        </li>
      </ul>
      <Area className={styles.wrapper}>
        <div className={styles.imageContainer}>
          <img
            className={cn(styles.dummyImage)}
            src="https://d1w1533jipmvi2.cloudfront.net/prfs_proof_example.png"
            crossOrigin="anonymous"
            alt="Prfs Proof example"
          />
          <img
            className={cn(styles.image, {
              [styles.isHighlighted]: highlightedFeature === HighlightedFeature.PrfsProof,
            })}
            src="https://d1w1533jipmvi2.cloudfront.net/prfs_proof_example.png"
            crossOrigin="anonymous"
            alt="Proof example"
          />
          <img
            className={cn(styles.image, {
              [styles.isHighlighted]: highlightedFeature === HighlightedFeature.PrfsAtst,
            })}
            src="https://d1w1533jipmvi2.cloudfront.net/prfs_atst_example2.png"
            crossOrigin="anonymous"
            alt="Prfs attestation example"
          />
          <img
            className={cn(styles.image, {
              [styles.isHighlighted]: highlightedFeature === HighlightedFeature.PrfsId,
            })}
            src="https://d1w1533jipmvi2.cloudfront.net/prfs_id_example.png"
            crossOrigin="anonymous"
            alt="Prfs Id example"
          />
        </div>
      </Area>
    </>
  );
};

export default FeatureList;

export interface LogoContainerProps {
  handleFocusSearchBar: () => void;
}
