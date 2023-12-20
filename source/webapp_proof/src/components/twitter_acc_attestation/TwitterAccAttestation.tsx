"use client";

import React from "react";
import cn from "classnames";

import styles from "./TwitterAccAttestation.module.scss";
import { i18nContext } from "@/i18n/context";
import { AttestationsMain, AttestationsTitle } from "@/components/attestations/Attestations";

const TwitterAccAttestation: React.FC<TwitterAccAttestationProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <>
      <AttestationsTitle>{i18n.create_twitter_acc_attestation}</AttestationsTitle>
      <div>
        <div>
          <input className={styles.input} placeholder={i18n.twitter_handle} />
        </div>
        <div>generate a claim</div>
        <div>Make a tweet</div>
        <div>
          <input className={styles.input} placeholder={i18n.tweet_url} />
        </div>
      </div>
    </>
  );
};

export default TwitterAccAttestation;

export interface TwitterAccAttestationProps {}
