"use client";

import React from "react";

import styles from "./CreateID.module.scss";
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
import { paths } from "@/paths";

const CreateID: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  const handleClickNext = React.useCallback(() => {}, []);

  const handleClickCreateId = React.useCallback(() => {}, []);

  return (
    <div className={styles.wrapper}>
      <SignInModule>
        <SignInModuleLogoArea />
        <SignInModuleHeader>
          <SignInModuleTitle>{i18n.sign_in}</SignInModuleTitle>
          <SignInModuleSubtitle>{i18n.use_your_zauth_identity}</SignInModuleSubtitle>
        </SignInModuleHeader>
        <SignInModuleInputArea>3</SignInModuleInputArea>
        <SignInModuleBtnRow>
          <Link href={paths.id}>
            <Button variant="transparent_blue_2" noTransition handleClick={handleClickCreateId}>
              {i18n.already_have_id}
            </Button>
          </Link>
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

export default CreateID;
