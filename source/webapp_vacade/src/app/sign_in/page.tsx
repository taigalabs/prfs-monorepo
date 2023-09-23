"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import styles from "./HomePage.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import useLocalWallet from "@/hooks/useLocalWallet";
import { useAppSelector } from "@/state/hooks";
import SignInLayout from "@/layouts/sign_in_layout/SignInLayout";
import SignInForm from "@/components/sign_in_form/SignInForm";

const SignInPage: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const dispatch = useDispatch();

  const localPrfsAccount = useAppSelector(state => state.user.localPrfsAccount);
  useLocalWallet(dispatch);

  React.useEffect(() => {
    if (localPrfsAccount) {
      router.push(`${paths.c}/crypto`);
    }
  }, [router]);

  return (
    <SignInLayout>
      <SignInForm />
    </SignInLayout>
  );
};

export default SignInPage;
