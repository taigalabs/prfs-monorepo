"use client";

import React from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useConnect, useAddress, useSigner, metamaskWallet } from "@thirdweb-dev/react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import SignInLayout from "@/layouts/sign_in_layout/SignInLayout";
import Widget from "@/components/widget/Widget";
import styles from "./SignIn.module.scss";
import { I18nContext } from "@/contexts";
import Logo from "@/components/logo/Logo";
import ConnectWalletWidget from "@/components/connect_wallet_widget/ConnectWalletWidget";

const metamaskConfig = metamaskWallet();

const SignIn: React.FC = () => {
  let i18n = React.useContext(I18nContext);

  const connect = useConnect();

  React.useEffect(() => {
    async function fn() {
      const wallet = await connect(metamaskConfig);
      console.log("wallet", wallet);
    }
    fn().then();
  }, []);

  const [walletSelected, setWalletSelected] = React.useState("metamask");

  return (
    <SignInLayout>
      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <div>
            <p>Sign In</p>
            <p>If you haven't signed up yet, sign up first.</p>
          </div>
          <ConnectWalletWidget className={styles.widget} />
          <Widget label={i18n.credential} className={styles.widget}>
            <TextField label="passcode" type="password" />
            <div>
              <p>id</p>
              <p>id-a</p>
            </div>
            <div>
              <p>password</p>
              <p>pw-a</p>
            </div>
            <button>Sign In</button>
          </Widget>
        </div>
      </div>
    </SignInLayout>
  );
};

export default SignIn;
