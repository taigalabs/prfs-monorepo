"use client";

import React from "react";
import Logo from "@taigalabs/prfs-react-components/src/logo/Logo";

import styles from "./SignInPage.module.scss";
import SignInForm from "@/components/sign_in_form/SignInForm";
import { useAppDispatch } from "@/state/hooks";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import { i18nContext } from "@/contexts/i18n";

const SignInPage: React.FC = () => {
  let i18n = React.useContext(i18nContext);

  return (
    <DefaultLayout>
      <div className={styles.wrapper}>
        <div className={styles.logoRow}>
          <Logo variant="simple" />
          <p className={styles.appName}>{i18n.zauth}</p>
        </div>
        <div className={styles.body}>
          <SignInForm />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SignInPage;
