"use client";

import React from "react";
import Link from "next/link";
import { useConnect, useAddress, useSigner, metamaskWallet } from "@thirdweb-dev/react";
import { ethers } from "ethers";

import { stateContext } from '@/contexts/state';
import SignInLayout from "@/layouts/sign_in_layout/SignInLayout";
import Widget from "@/components/widget/Widget";
import styles from "./SignIn.module.scss";
import { i18nContext } from "@/contexts/i18n";
import ConnectWalletWidget from "@/components/connect_wallet_widget/ConnectWalletWidget";
import Button from "@/components/button/Button";
import * as prfsBackend from '@/fetch/prfsBackend';

const metamaskConfig = metamaskWallet();

const SignIn: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const connect = useConnect();

  const { state, dispatch } = React.useContext(stateContext);
  const [walletAddr, setWalletAddr] = React.useState("");
  const [passcode, setPasscode] = React.useState("");
  const [passhash, setPasshash] = React.useState("");
  const [signInAlert, setSignInAlert] = React.useState("");

  const handleChangePasscode = React.useCallback(
    (ev: any) => {
      setPasscode(ev.target.value);
    },
    [setPasscode]
  );

  const handleConnect = React.useCallback(
    (addr: string) => {
      setWalletAddr(addr);
    },
    [setWalletAddr]
  );

  const handleClickHash = React.useCallback(() => {
    async function fn() {
      if (passcode.length > 0) {
        let prfs_pw_msg = `PRFS_PW_${passcode}`;
        let pw_hash = ethers.utils.hashMessage(prfs_pw_msg);

        setPasshash(pw_hash);
      } else {
      }
    }

    fn().then();
  }, [passcode, setPasshash]);

  const handleClickSignIn = React.useCallback(() => {
    async function fn() {
      console.log(22, walletAddr, passhash);

      if (walletAddr.length < 1) {
        setSignInAlert("Connect a wallet first");
        return;
      }

      if (passhash.length < 1) {
        setSignInAlert("Hash passcode first");
        return;
      }

      const wallet = await connect(metamaskConfig);
      const signer = await wallet.getSigner();
      let sig = await signer.signMessage(passhash);

      try {
        let resp = await prfsBackend.signInPrfsAccount(sig);


      } catch (err) {

      }
    }

    fn().then();
  }, [walletAddr, passhash, setSignInAlert]);

  return (
    <SignInLayout title={i18n.sign_in} desc={i18n.sign_in_desc}>
      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <ConnectWalletWidget className={styles.widget} handleConnect={handleConnect} />
          <Widget label={i18n.credential} className={styles.widget}>
            <div className={styles.widgetInner}>
              <div className={styles.passcode}>
                <p className={styles.label}>Passcode</p>
                <input type="password" onChange={handleChangePasscode} />
              </div>
              <div className={styles.hashBtnRow}>
                <Button variant="a" handleClick={handleClickHash}>
                  {i18n.hash}
                </Button>
              </div>
            </div>
            {passhash.length > 0 && (
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
            {signInAlert.length > 0 && <div className={styles.signInAlert}>{signInAlert}</div>}
            <Button variant="b" handleClick={handleClickSignIn}>
              {i18n.sign_in}
            </Button>
          </div>
        </div>
      </div>
    </SignInLayout>
  );
};

export default SignIn;
