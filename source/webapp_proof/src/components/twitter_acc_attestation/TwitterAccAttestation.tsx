"use client";

import React from "react";
import cn from "classnames";
import { Input } from "@taigalabs/prfs-react-components/src/input/Input";

import styles from "./TwitterAccAttestation.module.scss";
import { i18nContext } from "@/i18n/context";
import { AttestationsMain, AttestationsTitle } from "@/components/attestations/Attestations";

const TwitterAccAttestation: React.FC<TwitterAccAttestationProps> = () => {
  const i18n = React.useContext(i18nContext);
  const [twitterHandle, setTwitterHandle] = React.useState("");

  const handleChangeTwitterHandle = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setTwitterHandle(value);
    },
    [setTwitterHandle],
  );

  return (
    <>
      <AttestationsTitle className={styles.title}>
        {i18n.create_twitter_acc_attestation}
      </AttestationsTitle>
      <div>
        <form>
          <ol className={styles.instructions}>
            <li className={styles.item}>
              <p className={styles.desc}>label</p>
              <div className={styles.content}>
                <Input
                  className={styles.input}
                  error={""}
                  label={i18n.twitter_handle}
                  value={twitterHandle}
                  handleChangeValue={handleChangeTwitterHandle}
                />
              </div>
            </li>
            <li className={styles.item}>
              <p className={styles.desc}>generate a claim</p>
              <div className={styles.content}>claim</div>
            </li>
            <li className={styles.item}>
              <p className={styles.desc}>Make a tweet</p>
              <div className={styles.content}>tweet button</div>
            </li>
            <li className={styles.item}>
              <p className={styles.desc}>Make a tweet</p>
              <div className={styles.content}>
                <Input
                  className={styles.input}
                  error={""}
                  label={i18n.tweet_url}
                  value={twitterHandle}
                  handleChangeValue={handleChangeTwitterHandle}
                />
              </div>
            </li>
          </ol>
          <div className={styles.btnRow}>
            <button type="button">{i18n.create}</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default TwitterAccAttestation;

export interface TwitterAccAttestationProps {}
