"use client";

import React from "react";

import styles from "./SignUp.module.scss";
import SignInLayout from "@/layouts/sign_in_layout/SignInLayout";
import { i18nContext } from "@/contexts/i18n";
import { stateContext } from "@/contexts/state";
import useLocalWallet from "@/hooks/useLocalWallet";
import SignUpForm from "@/components/sign_up_form/SignUpForm";

const SignUp: React.FC = () => {
  let i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  return (
    <SignInLayout>
      <SignUpForm />
      {/* title={i18n.sign_up} desc={i18n.sign_up_desc}> */}
    </SignInLayout>
  );
};

export default SignUp;
