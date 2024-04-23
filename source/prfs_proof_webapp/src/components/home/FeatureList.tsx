import React from "react";
import cn from "classnames";

import styles from "./FeatureList.module.scss";
import { useI18N } from "@/i18n/use_i18n";

const FeatureList: React.FC<LogoContainerProps> = ({ handleFocusSearchBar }) => {
  const i18n = useI18N();

  return (
    <div className={styles.wrapper}>
      <div className={cn(styles.item)}>
        <div className={styles.itemContent}>
          <p className={styles.title}>Create a zero-knowledge proof on your own</p>
          <p className={styles.desc}>
            It is important that you are able to create proof with minimal reliance on others. Prfs
            is designed to help you make an anonymous claim by yourself on any device you have.
          </p>
        </div>
        <div className={styles.image}>
          <div className={styles.imgLabel}>
            <p>Prfs Proof generate</p>
          </div>
          <img
            src="https://d1w1533jipmvi2.cloudfront.net/prfs_proof_1.png"
            crossOrigin="anonymous"
            alt="Proof example"
          />
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.itemContent}>
          <p className={styles.title}>Attest to your data to create an anonymous claim about it</p>
          <p className={styles.desc}>
            When you attest to your data, the data that would anyway be available on the open space,
            either in part or as whole, it becomes efficient for you to generate proof.
          </p>
        </div>
        <div className={styles.image}>
          <div className={styles.imgLabel}>
            <p>Prfs Attestation</p>
          </div>
          <img
            src="https://d1w1533jipmvi2.cloudfront.net/prfs_attestation_1.png"
            crossOrigin="anonymous"
            alt="Prfs attestation example"
          />
        </div>
      </div>
      <div className={cn(styles.item)}>
        <div className={styles.itemContent}>
          <p className={styles.title}>Use the Internet more safely regardless of where you are</p>
          <p className={styles.desc}>
            Prfs Id is designed to assist you to create secure data in whatever the environment you
            are in. Do not constrain yourself from using the app for not having the device you are
            used to.
          </p>
        </div>
        <div className={styles.image}>
          <div className={styles.imgLabel}>
            <p>Prfs Identity</p>
          </div>
          <img
            src="https://d1w1533jipmvi2.cloudfront.net/prfs_id_1.png"
            crossOrigin="anonymous"
            alt="Prfs Id example"
          />
        </div>
      </div>
    </div>
  );
};

export default FeatureList;

export interface LogoContainerProps {
  handleFocusSearchBar: () => void;
}
