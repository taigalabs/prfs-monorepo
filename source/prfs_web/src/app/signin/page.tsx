"use client";

import React from "react";

import styles from "./page.module.scss";
import { I18nContext } from "@/contexts";
import Button from "@mui/material/Button";

const SignIn: React.FC = () => {
  let i18n = React.useContext(I18nContext);

  return (
    <div className={styles.wrapper}>
      <div>
        <div className={styles.input}>
          <input type="password"></input>
          <Button variant="contained">Sign in</Button>
        </div>
        <div className={styles.desc}>
          <ol>
            <li>{i18n.desc_1}</li>
            <li>{i18n.desc_2}</li>
            <li>{i18n.desc_3}</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
