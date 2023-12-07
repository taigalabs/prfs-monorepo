"use client";

import React from "react";
import styles from "./SignIn.module.scss";
import { i18nContext } from "@/contexts/i18n";
import SignInModule, {
  SignInModuleBtnRow,
  SignInModuleHeader,
  SignInModuleInputArea,
  SignInModuleLogoArea,
  SignInModuleSubtitle,
  SignInModuleTitle,
} from "@/components/sign_in_module/SignInModule";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { paths } from "@/paths";

const SignIn: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  const handleClickSignIn = React.useCallback(() => {}, [router]);

  const handleClickCreateID = React.useCallback(() => {
    const { search } = window.location;
    const url = `${paths.accounts__create}${search}`;
    router.push(url);
  }, [router]);

  return (
    <div className={styles.wrapper}>
      <SignInModule>
        <SignInModuleLogoArea />
        <SignInModuleHeader>
          <SignInModuleTitle>{i18n.sign_in}</SignInModuleTitle>
          <SignInModuleSubtitle>{i18n.use_your_prfs_identity}</SignInModuleSubtitle>
        </SignInModuleHeader>
        <SignInModuleInputArea>3</SignInModuleInputArea>
        <SignInModuleBtnRow>
          <Button variant="transparent_blue_2" noTransition handleClick={handleClickCreateID}>
            {i18n.create_id}
          </Button>
          <Button
            variant="blue_2"
            className={styles.signInBtn}
            noTransition
            handleClick={handleClickSignIn}
            noShadow
          >
            {i18n.sign_in}
          </Button>
        </SignInModuleBtnRow>
      </SignInModule>
    </div>
  );
};

export default SignIn;
