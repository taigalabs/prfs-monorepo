"use client";

import React from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import {
  useConnect,
  useAddress,
  useSigner,
  metamaskWallet,
  ConnectWallet
} from "@thirdweb-dev/react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import SignInLayout from "@/layouts/sign_in_layout/SignInLayout";
import Widget from "@/components/widget/Widget";
import styles from "./SignUp.module.scss";
import { I18nContext } from "@/contexts";
import Logo from "@/components/logo/Logo";
import ConnectWalletWidget from "@/components/connect_wallet_widget/ConnectWalletWidget";

const metamaskConfig = metamaskWallet();

const SignUp: React.FC = () => {
  let i18n = React.useContext(I18nContext);
  const connect = useConnect();

  const [walletAddr, setWalletAddr] = React.useState("");
  const [passcode, setPasscode] = React.useState("");
  const [id, setId] = React.useState("");
  const [passhash, setPasshash] = React.useState("");
  const [signUpAlert, setSignUpAlert] = React.useState("");

  React.useEffect(() => {
    async function fn() {
      const wallet = await connect(metamaskConfig);
      console.log("wallet", wallet);
    }
    fn().then();
  }, []);

  const handleClickSignUp = React.useCallback(() => {
    async function fn() {
      console.log(22, walletAddr, passhash);

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
      let hash = await signer.signMessage(passhash);

      console.log(55, hash);
    }

    fn().then();
  }, [walletAddr, passhash, setSignUpAlert]);

  const handleClickHash = React.useCallback(() => {
    async function fn() {
      if (passcode.length > 0) {
        let prfs_id_msg = `PRFS_ID_${passcode}`;
        let prfs_pw_msg = `PRFS_PW_${passcode}`;

        // let id_hash = ethers.utils.hashMessage(prfs_id_msg);
        // let pw_hash = ethers.utils.hashMessage(prfs_pw_msg);

        // setId(id_hash);
        // setPasshash(pw_hash);
      } else {
      }
    }

    fn().then();
  }, [passcode, setId, setPasshash]);

  const handleConnect = React.useCallback(() => {
    console.log(11);
  }, []);

  return (
    <SignInLayout title={i18n.sign_up} desc={i18n.sign_up_desc}>
      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <ConnectWalletWidget className={styles.widget} handleConnect={handleConnect} />
          <Widget label={i18n.credential} className={styles.widget}>
            <div className={styles.widgetInner}>
              <div className={styles.passcode}>
                <p>passcode</p>
                <input type="password" />
              </div>
              <div className={styles.passcode}>
                <p>passcode</p>
                <input type="password" />
              </div>
              <div className={styles.hashBtnRow}>
                <button className={styles.hashBtn} onClick={handleClickHash}>
                  {i18n.hash}
                </button>
              </div>
            </div>
            {passhash && (
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
            {signUpAlert.length > 0 && <div className={styles.signUpAlert}>{signUpAlert}</div>}
            <button className={styles.signInBtn} onClick={handleClickSignUp}>
              {i18n.sign_up}
            </button>
          </div>
        </div>
      </div>
    </SignInLayout>
  );
};

export default SignUp;
