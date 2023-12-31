import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Link from "next/link";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import { PrfsIdCredential, makePrfsIdCredential } from "@taigalabs/prfs-id-sdk-web";

import styles from "./InputCreateIdCredential.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  SignInInnerPadding,
  SignInInputGuide,
  SignInInputItem,
  SignInModuleBtnRow,
  SignInModuleHeader,
  SignInModuleInputArea,
  SignInModuleLogoArea,
  SignInModuleSubtitle,
  SignInModuleTitle,
} from "@/components/sign_in_module/SignInModule";
import { IdCreateForm } from "@/functions/validate_id";

const InputCreateIdCredential: React.FC<InputCreateIdCredentialProps> = ({
  formData,
  setFormData,
  formErrors,
  handleClickSignIn,
  handleClickNext,
  setCredential,
}) => {
  const i18n = React.useContext(i18nContext);

  const handleChangeValue = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const name = ev.target.name;
      const val = ev.target.value;

      if (name) {
        setFormData(oldVal => {
          return {
            ...oldVal,
            [name]: val,
          };
        });
      }
    },
    [formData, setFormData],
  );

  const enhancedHandleClickNext = React.useCallback(async () => {
    const credential = await makePrfsIdCredential({
      email: formData.email,
      password_1: formData.password_1,
      password_2: formData.password_2,
    });
    console.log("credential", credential);

    setCredential(credential);
    handleClickNext();
  }, [handleClickNext, setCredential]);

  return (
    <SignInInnerPadding>
      <SignInModuleLogoArea />
      <Fade>
        <SignInModuleHeader>
          <SignInModuleTitle>{i18n.create_an_identity}</SignInModuleTitle>
          <SignInModuleSubtitle>{i18n.create_a_strong_password}</SignInModuleSubtitle>
        </SignInModuleHeader>
        <SignInModuleInputArea>
          <div className={styles.inputGroup}>
            <SignInInputItem
              name="email"
              value={formData.email}
              placeholder={i18n.email}
              error={formErrors.email}
              handleChangeValue={handleChangeValue}
            />
            <SignInInputItem
              name="email_confirm"
              value={formData.email_confirm}
              placeholder={i18n.confirm}
              error={formErrors.email_confirm}
              handleChangeValue={handleChangeValue}
            />
          </div>
          <SignInInputGuide>
            <Link
              href={`${process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}/identity`}
              target="_blank"
            >
              {i18n.why_we_ask_for_email}
            </Link>
          </SignInInputGuide>
          <div className={styles.inputGroup}>
            <SignInInputItem
              name="password_1"
              value={formData.password_1}
              placeholder={i18n.password_1}
              error={formErrors.password_1}
              handleChangeValue={handleChangeValue}
              type="password"
            />
            <SignInInputItem
              name="password_1_confirm"
              value={formData.password_1_confirm}
              placeholder={i18n.confirm}
              error={formErrors.password_1_confirm}
              handleChangeValue={handleChangeValue}
              type="password"
            />
          </div>
          <div className={styles.inputGroup}>
            <SignInInputItem
              name="password_2"
              value={formData.password_2}
              placeholder={i18n.password_2}
              error={formErrors.password_2}
              handleChangeValue={handleChangeValue}
              type="password"
            />
            <SignInInputItem
              name="password_2_confirm"
              value={formData.password_2_confirm}
              placeholder={i18n.confirm}
              error={formErrors.password_2_confirm}
              handleChangeValue={handleChangeValue}
              type="password"
            />
          </div>
          <SignInInputGuide>
            <Link
              href={`${process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}/identity`}
              target="_blank"
            >
              {i18n.why_we_ask_for_two_passwords}
            </Link>
          </SignInInputGuide>
        </SignInModuleInputArea>
        <SignInModuleBtnRow>
          <Button
            type="button"
            variant="transparent_blue_2"
            noTransition
            handleClick={handleClickSignIn}
            noShadow
          >
            {i18n.already_have_id}
          </Button>
          <Button
            type="button"
            variant="blue_2"
            className={styles.nextBtn}
            noTransition
            handleClick={enhancedHandleClickNext}
            noShadow
          >
            {i18n.next}
          </Button>
        </SignInModuleBtnRow>
      </Fade>
    </SignInInnerPadding>
  );
};

export default InputCreateIdCredential;

export interface InputCreateIdCredentialProps {
  formData: IdCreateForm;
  setFormData: React.Dispatch<React.SetStateAction<IdCreateForm>>;
  formErrors: IdCreateForm;
  handleClickNext: () => void;
  handleClickSignIn: () => void;
  setCredential: React.Dispatch<React.SetStateAction<PrfsIdCredential | null>>;
}
