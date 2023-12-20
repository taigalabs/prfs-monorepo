"use client";

import React from "react";
import cn from "classnames";
import { Input } from "@taigalabs/prfs-react-components/src/input/Input";

import styles from "./TwitterAccAttestation.module.scss";
import { i18nContext } from "@/i18n/context";
import { AttestationsMain, AttestationsTitle } from "@/components/attestations/Attestations";

const TWITTER_HANDLE = "twitter_handle";
const TWEET_URL = "tweet_url";

const TwitterAccAttestation: React.FC<TwitterAccAttestationProps> = () => {
  const i18n = React.useContext(i18nContext);
  const [formData, setFormData] = React.useState({ [TWITTER_HANDLE]: "", [TWEET_URL]: "" });

  const handleChangeTwitterHandle = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, name } = e.target;

      setFormData(oldVal => ({
        ...oldVal,
        [name]: value,
      }));
    },
    [setFormData],
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
              <p className={styles.desc}>{i18n.what_is_your_twitter_handle}</p>
              <div className={styles.content}>
                <Input
                  className={styles.input}
                  name={TWITTER_HANDLE}
                  error={""}
                  label={i18n.twitter_handle}
                  value={formData.twitter_handle}
                  handleChangeValue={handleChangeTwitterHandle}
                />
              </div>
            </li>
            <li className={styles.item}>
              <p className={styles.desc}>{i18n.generate_a_cryptographic_claim}</p>
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
                  name={TWEET_URL}
                  error={""}
                  label={i18n.tweet_url}
                  value={formData.tweet_url}
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
