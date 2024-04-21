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
            It is important that you are able to create a proof with minimal reliance on others.
            Prfs is designed to allow you to make an anonymous claim by yourself.
          </p>
        </div>
        <div className={styles.image}>
          <img
            src="https://d1w1533jipmvi2.cloudfront.net/prfs_proof_1.png"
            crossOrigin="anonymous"
            alt="Proof example"
          />
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.box}>
          <div className={styles.image}>
            <img
              src="https://d1w1533jipmvi2.cloudfront.net/prfs_attestation_1.png"
              crossOrigin="anonymous"
              alt="Prfs attestation example"
            />
          </div>
          <div className={styles.itemContent}>
            <div className={styles.inner}>
              <p className={styles.title}>
                Attest to your data to create an anonymous claim about it
              </p>
              <p className={styles.desc}>
                When you attest to your data, the data that would anyway be available on the open
                space, it becomes much efficient for you to generate a proof.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className={cn(styles.item)}>
        <div className={styles.box}>
          <div className={styles.image}>
            <img
              src="https://d1w1533jipmvi2.cloudfront.net/prfs_id_1.png"
              crossOrigin="anonymous"
              alt="Prfs Id example"
            />
          </div>
          <div className={styles.itemContent}>
            <div className={styles.inner}>
              <p className={styles.title}>Use the Internet more safely on any device you have</p>
              <p className={styles.desc}>
                Prfs Id is designed to give you a similar experience you get when using other web
                applications. Use security-enhanced apps on devices that you are already used to
              </p>
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
