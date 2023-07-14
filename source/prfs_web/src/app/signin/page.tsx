"use client";

import React from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";

import styles from "./page.module.scss";
import { I18nContext } from "@/contexts";
import Logo from "@/components/logo/Logo";

const SignIn: React.FC = () => {
  let i18n = React.useContext(I18nContext);

  return (
    <div className={styles.wrapper}>
      <div>
        <div>
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className={styles.input}>
          <TextField label="passcode" type="password" />
          <Button variant="contained">Sign in</Button>
        </div>
        <Divider />
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
        <div>sign in Footer</div>
      </div>
    </div>
  );
};

export default SignIn;
