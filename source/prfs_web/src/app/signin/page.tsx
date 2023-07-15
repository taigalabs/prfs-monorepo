"use client";

import React from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useConnect, useAddress, useSigner, metamaskWallet } from "@thirdweb-dev/react";

import SignInLayout from "@/layouts/sign_in_layout/SignInLayout";
import Widget from "@/components/widget/Widget";
import styles from "./SignIn.module.scss";
import { I18nContext } from "@/contexts";
import Logo from "@/components/logo/Logo";

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

  return (
    <SignInLayout>
      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <div className={styles.upper}>
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <Widget label={i18n.wallet} className={styles.widget}>
            power
          </Widget>
          <Widget label="power" className={styles.widget}>
            <TextField label="passcode" type="password" />
            <Button variant="contained">Sign in</Button>
            <Divider />

            <TextField label="id" disabled />
            <TextField label="passcode" disabled />
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

export default SignIn;
