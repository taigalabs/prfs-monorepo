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
          <div className={styles.upper}>
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <Widget label={i18n.connect_wallet} className={styles.widget}>
            <div>
              <div className={`${styles.radioBox}`}>
                <div>
                  <input type="radio" value="metamask" checked />
                </div>
                <div>
                  <p className={styles.label}>{i18n.metamask}</p>
                  <p className={styles.desc}>{i18n.metamask_desc}</p>
                </div>
              </div>
            </div>
            <div>
              <button>{i18n.connect}</button>
            </div>
            <div>wallet status</div>
          </Widget>
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

export default SignIn;
