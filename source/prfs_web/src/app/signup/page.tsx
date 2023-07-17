"use client";

import React from "react";
import Link from "next/link";
import { useConnect, useAddress, useSigner, metamaskWallet } from "@thirdweb-dev/react";
import { ethers } from 'ethers';

import SignInLayout from "@/layouts/sign_in_layout/SignInLayout";
import Widget from "@/components/widget/Widget";
import styles from "./SignUp.module.scss";
import { i18nContext } from "@/contexts/i18n";
import ConnectWalletWidget from "@/components/connect_wallet_widget/ConnectWalletWidget";
import Button from "@/components/button/Button";
import * as prfsBackend from '@/fetch/prfsBackend';

const metamaskConfig = metamaskWallet();

const SignUp: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const connect = useConnect();

  const [walletAddr, setWalletAddr] = React.useState("");
  const [hashAlert, setHashAlert] = React.useState("");
  const [passcode, setPasscode] = React.useState("");
  const [passcodeConfirm, setPasscodeConfirm] = React.useState("");
  const [passhash, setPasshash] = React.useState("");
  const [signUpAlert, setSignUpAlert] = React.useState("");

  const handleChangePasscode = React.useCallback(
    (ev: any) => {
      setPasscode(ev.target.value);
    },
    [setPasscode]
  );

  const handleChangePasscodeConfirm = React.useCallback(
    (ev: any) => {
      setPasscodeConfirm(ev.target.value);
    },
    [setPasscodeConfirm]
  );

  const handleClickHash = React.useCallback(() => {
    async function fn() {
      if (passcode.length < 0) {
        setHashAlert("Passcode is too short");
        setPasshash("");
        return;
      }

      if (passcode !== passcodeConfirm) {
        setHashAlert("Two passcodes are not identical");
        setPasshash("");
        return;
      }

      let prfs_pw_msg = `PRFS_PW_${passcode}`;
      let pw_hash = ethers.utils.hashMessage(prfs_pw_msg);

      setHashAlert("");
      setPasshash(pw_hash);
    }

    fn().then();
  }, [passcode, passcodeConfirm, setPasshash, setHashAlert]);

  const handleClickSignUp = React.useCallback(() => {
    async function fn() {
      if (walletAddr.length < 1) {
        setSignUpAlert("Connect a wallet first");
        return;
      }

      if (passhash.length < 1) {
        setSignUpAlert("Hash passcode first");
        return;
      }

      const wallet = await connect(metamaskConfig);
      const signer = await wallet.getSigner();
      const sig = await signer.signMessage(passhash);

      try {
        let resp = await prfsBackend.signUpPrfsAccount(sig);
        if (resp.error) {
          return;
        }
      } catch (err) {

      }
    }

    fn().then();
  }, [walletAddr, passhash, setSignUpAlert]);


  const handleConnect = React.useCallback((addr: string) => {
    setWalletAddr(addr);
  }, [setWalletAddr]);

  return (
    <SignInLayout title={i18n.sign_up} desc={i18n.sign_up_desc}>
      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <div className={styles.signInBtnRow}>
            <Button variant="transparent_a">
              <Link href="/signin">{i18n.sign_in_to_existing}</Link>
            </Button>
          </div>
          <ConnectWalletWidget className={styles.widget} handleConnect={handleConnect} />
          <Widget label={i18n.credential} className={styles.widget}>
            <div className={styles.widgetInner}>
              <div className={styles.passcode}>
                <p>{i18n.passcode}</p>
                <input type="password" onChange={handleChangePasscode} />
              </div>
              <div className={styles.passcode}>
                <p>{i18n.passcode_confirm}</p>
                <input type="password" onChange={handleChangePasscodeConfirm} />
              </div>
              {hashAlert.length > 0 && (
                <div className={styles.hashAlert}>
                  {hashAlert}
                </div>
              )}
              <div className={styles.hashBtnRow}>
                <Button variant="a" handleClick={handleClickHash}>
                  {i18n.hash}
                </Button>
              </div>
            </div>
            {passhash && (
              <div className={styles.widgetInner}>
                <div className={styles.hashResult}>
                  <div>
                    <p className={styles.label}>passhash</p>
                    <p className={styles.val}>{passhash}</p>
                  </div>
                </div>
              </div>
            )}
          </Widget>
          <div>
            {signUpAlert.length > 0 && <div className={styles.signUpAlert}>{signUpAlert}</div>}
            <Button variant="b" handleClick={handleClickSignUp}>
              {i18n.sign_up}
            </Button>
          </div>
        </div>
      </div>
    </SignInLayout>
  );
};

export default SignUp;
