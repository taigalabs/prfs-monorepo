"use client";

import React from "react";
import cn from "classnames";
import { Input } from "@taigalabs/prfs-react-components/src/input/Input";

import styles from "./CreateTwitterAccAtst.module.scss";
import { i18nContext } from "@/i18n/context";
import { AttestationsMain, AttestationsTitle } from "@/components/attestations/Attestations";

const TWITTER_HANDLE = "twitter_handle";
const TWEET_URL = "tweet_url";

const TwitterAccAttestation: React.FC<TwitterAccAttestationProps> = () => {
  const i18n = React.useContext(i18nContext);
  const [formData, setFormData] = React.useState({ [TWITTER_HANDLE]: "", [TWEET_URL]: "" });
  const claimSecret = React.useMemo(() => {
    const handle = formData[TWITTER_HANDLE];
    return `PRFS_ATTESTATION_${handle}`;
  }, [formData[TWITTER_HANDLE]]);

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
              <div className={styles.no}>1</div>
              <div className={styles.right}>
                <p className={styles.desc}>
                  <span>{i18n.what_is_your_twitter_handle}</span>
                </p>
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
              </div>
            </li>
            <li className={styles.item}>
              <div className={styles.no}>2</div>
              <div>
                <p className={styles.desc}>
                  <span>{i18n.generate_a_cryptographic_claim}. </span>
                  <span>
                    {i18n.claim_secret}: {claimSecret}
                  </span>
                </p>
                <div className={styles.content}>claim</div>
              </div>
            </li>
            <li className={styles.item}>
              <div className={styles.no}>3</div>
              <div>
                <p className={styles.desc}>Make a tweet</p>
                <div className={styles.content}>tweet button</div>
              </div>
            </li>
            <li className={styles.item}>
              <div className={styles.no}>4</div>
              <div>
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
