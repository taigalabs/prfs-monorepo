"use client";

import React from "react";

import styles from "./SignIn.module.scss";
// import { stateContext } from "@/contexts/state";
import SignInLayout from "@/layouts/sign_in_layout/SignInLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import SignInForm from "@/components/sign_in_form/SignInForm";
import { useAppDispatch } from "@/state/hooks";

const SignIn: React.FC = () => {
  // const { dispatch } = React.useContext(stateContext);

  const dispatch = useAppDispatch();
  useLocalWallet(dispatch);

  return (
    <SignInLayout>
      <SignInForm />
    </SignInLayout>
  );
};

export default SignIn;
