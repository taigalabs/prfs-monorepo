"use client";

import React from "react";

import styles from "./SignIn.module.scss";
import { i18nContext } from "@/contexts/i18n";
import SignInModule, {
  SignInModuleBtnRow,
  SignInModuleInputArea,
  SignInModuleLogoArea,
} from "@/components/sign_in_module/SignInModule";
import Button from "@taigalabs/prfs-react-components/src/button/Button";

const SignIn: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const handleClickNext = React.useCallback(() => {}, []);

  return (
    <div className={styles.wrapper}>
      <SignInModule>
        <SignInModuleLogoArea />
        <SignInModuleInputArea>1</SignInModuleInputArea>
        <SignInModuleBtnRow>
          <Button
            variant="transparent_blue_2"
            className={styles.signInBtn}
            noTransition
            handleClick={handleClickNext}
          >
            {i18n.create_id}
          </Button>
          <Button
            variant="blue_2"
            className={styles.signInBtn}
            noTransition
            handleClick={handleClickNext}
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
