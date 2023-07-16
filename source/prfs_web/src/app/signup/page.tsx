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
import styles from "./SignIn.module.scss";
import { I18nContext } from "@/contexts";
import Logo from "@/components/logo/Logo";
import ConnectWalletWidget from "@/components/connect_wallet_widget/ConnectWalletWidget";

const metamaskConfig = metamaskWallet();

const SignUp: React.FC = () => {
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
    <SignInLayout title={i18n.sign_up} desc={i18n.sign_up_desc}>
      <div className={styles.wrapper}>
        <div>Sign Up</div>
        <div className={styles.inner}>
          <div className={styles.upper}>
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <ConnectWalletWidget />
          <Widget label={i18n.credential} className={styles.widget}>
            <TextField label="passcode" type="password" />
            <div>power</div>
            <div>power2</div>
            <div className={styles.desc}>
              <ul>
                <li>
                  <Typography variant="body1" gutterBottom>
                    {i18n.desc_1}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" gutterBottom>
                    {i18n.desc_2}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" gutterBottom>
                    {i18n.desc_3}
                  </Typography>
                </li>
              </ul>
            </div>
          </Widget>
          <div className={styles.footer}>sign in Footer</div>
        </div>
      </div>
    </SignInLayout>
  );
};

export default SignUp;
