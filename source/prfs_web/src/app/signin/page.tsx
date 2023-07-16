"use client";

import React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useConnect, useAddress, useSigner, metamaskWallet } from "@thirdweb-dev/react";
import { ethers } from "ethers";

import SignInLayout from "@/layouts/sign_in_layout/SignInLayout";
import Widget from "@/components/widget/Widget";
import styles from "./SignIn.module.scss";
import { I18nContext } from "@/contexts";
import ConnectWalletWidget from "@/components/connect_wallet_widget/ConnectWalletWidget";

const metamaskConfig = metamaskWallet();

const SignIn: React.FC = () => {
  const i18n = React.useContext(I18nContext);

  const connect = useConnect();

  const [walletAddr, setWalletAddr] = React.useState("");
  const [passcode, setPasscode] = React.useState("");
  const [id, setId] = React.useState("");
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
        let prfs_id_msg = `PRFS_ID_${passcode}`;
        let prfs_pw_msg = `PRFS_PW_${passcode}`;

        let id_hash = ethers.utils.hashMessage(prfs_id_msg);
        let pw_hash = ethers.utils.hashMessage(prfs_pw_msg);

        setId(id_hash);
        setPasshash(pw_hash);
      } else {
      }
    }

    fn().then();
  }, [passcode, setId, setPasshash]);

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
      let hash = await signer.signMessage(passhash);

      console.log(55, hash);
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
                <button className={styles.hashBtn} onClick={handleClickHash}>
                  {i18n.hash}
                </button>
              </div>
            </div>
            {id.length > 0 && (
              <div className={styles.widgetInner}>
                <div className={styles.hashResult}>
                  <div className={styles.id}>
                    <p className={styles.label}>id</p>
                    <p className={styles.val}>{id}</p>
                  </div>
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
            <button className={styles.signInBtn} onClick={handleClickSignIn}>
              {i18n.sign_in}
            </button>
          </div>
        </div>
      </div>
    </SignInLayout>
  );
};

export default SignIn;
