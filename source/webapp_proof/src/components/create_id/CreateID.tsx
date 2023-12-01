"use client";

import React from "react";

import styles from "./CreateID.module.scss";
import { i18nContext } from "@/contexts/i18n";
import SignInModule, {
  SignInInputGuide,
  SignInInputItem,
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

  const [formData, setFormData] = React.useState({
    email: "",
    email_confirm: "",
    password_1: "",
    password_1_confirm: "",
    password_2: "",
    password_2_confirm: "",
  });

  const [formErrors, setFormErrors] = React.useState({
    email: undefined,
    email_confirm: undefined,
    password_1: undefined,
    password_1_confirm: undefined,
    password_2: undefined,
    password_2_confirm: undefined,
  });

  const handleClickNext = React.useCallback(() => {}, [formData]);

  return (
    <div className={styles.wrapper}>
      <SignInModule>
        <SignInModuleLogoArea />
        <SignInModuleHeader>
          <SignInModuleTitle>{i18n.create_zauth_identity}</SignInModuleTitle>
        </SignInModuleHeader>
        <SignInModuleInputArea>
          <div className={styles.inputGroup}>
            <SignInInputItem placeholder={i18n.email} />
            <SignInInputItem placeholder={i18n.confirm} />
          </div>
          <SignInInputGuide>{i18n.why_we_ask_for_email}</SignInInputGuide>
          <div className={styles.inputGroup}>
            <SignInInputItem placeholder={i18n.password_1} />
            <SignInInputItem placeholder={i18n.confirm} />
          </div>
          <div className={styles.inputGroup}>
            <SignInInputItem placeholder={i18n.password_2} />
            <SignInInputItem placeholder={i18n.confirm} />
          </div>
          <SignInInputGuide>{i18n.why_we_ask_for_two_passwords}</SignInInputGuide>
        </SignInModuleInputArea>
        <SignInModuleBtnRow>
          <Link href={paths.id}>
            <Button variant="transparent_blue_2" noTransition>
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
            {i18n.next}
          </Button>
        </SignInModuleBtnRow>
      </SignInModule>
    </div>
  );
};

export default CreateID;
