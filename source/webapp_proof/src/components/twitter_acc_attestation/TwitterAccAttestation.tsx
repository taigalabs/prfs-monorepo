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
      <AttestationsTitle>{i18n.create_twitter_acc_attestation}</AttestationsTitle>
      <div>
        <form>
          <ol>
            <li>
              <div>
                <Input
                  className={styles.input}
                  error={""}
                  label={i18n.twitter_handle}
                  value={twitterHandle}
                  handleChangeValue={handleChangeTwitterHandle}
                />
              </div>
            </li>
            <li>
              <div>generate a claim</div>
            </li>
            <li>
              <div>Make a tweet</div>
            </li>
            <li>
              <div>
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
          <button>{i18n.create}</button>
        </form>
      </div>
    </>
  );
};

export default TwitterAccAttestation;

export interface TwitterAccAttestationProps {}
