import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Link from "next/link";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import { PrfsIdCredential, makePrfsIdCredential } from "@taigalabs/prfs-id-sdk-web";

import styles from "./InputCreateIdCredential.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  PrfsIdSignInInnerPadding,
  PrfsIdSignInInputGuide,
  PrfsIdSignInInputItem,
  PrfsIdSignInModuleBtnRow,
  PrfsIdSignInModuleHeader,
  PrfsIdSignInModuleInputArea,
  PrfsIdSignInModuleLogoArea,
  PrfsIdSignInModuleSubtitle,
  PrfsIdSignInModuleTitle,
} from "@/components/prfs_id/prfs_id_sign_in_module/PrfsIdSignInModule";
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
    <PrfsIdSignInInnerPadding>
      <PrfsIdSignInModuleLogoArea />
      <Fade>
        <PrfsIdSignInModuleHeader>
          <PrfsIdSignInModuleTitle>{i18n.create_an_identity}</PrfsIdSignInModuleTitle>
          <PrfsIdSignInModuleSubtitle>{i18n.create_a_strong_password}</PrfsIdSignInModuleSubtitle>
        </PrfsIdSignInModuleHeader>
        <PrfsIdSignInModuleInputArea>
          <div className={styles.inputGroup}>
            <PrfsIdSignInInputItem
              name="email"
              value={formData.email}
              placeholder={i18n.email}
              error={formErrors.email}
              handleChangeValue={handleChangeValue}
            />
            <PrfsIdSignInInputItem
              name="email_confirm"
              value={formData.email_confirm}
              placeholder={i18n.confirm}
              error={formErrors.email_confirm}
              handleChangeValue={handleChangeValue}
            />
          </div>
          <PrfsIdSignInInputGuide>
            <Link
              href={`${process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}/identity`}
              target="_blank"
            >
              {i18n.why_we_ask_for_email}
            </Link>
          </PrfsIdSignInInputGuide>
          <div className={styles.inputGroup}>
            <PrfsIdSignInInputItem
              name="password_1"
              value={formData.password_1}
              placeholder={i18n.password_1}
              error={formErrors.password_1}
              handleChangeValue={handleChangeValue}
              type="password"
            />
            <PrfsIdSignInInputItem
              name="password_1_confirm"
              value={formData.password_1_confirm}
              placeholder={i18n.confirm}
              error={formErrors.password_1_confirm}
              handleChangeValue={handleChangeValue}
              type="password"
            />
          </div>
          <div className={styles.inputGroup}>
            <PrfsIdSignInInputItem
              name="password_2"
              value={formData.password_2}
              placeholder={i18n.password_2}
              error={formErrors.password_2}
              handleChangeValue={handleChangeValue}
              type="password"
            />
            <PrfsIdSignInInputItem
              name="password_2_confirm"
              value={formData.password_2_confirm}
              placeholder={i18n.confirm}
              error={formErrors.password_2_confirm}
              handleChangeValue={handleChangeValue}
              type="password"
            />
          </div>
          <PrfsIdSignInInputGuide>
            <Link
              href={`${process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}/identity`}
              target="_blank"
            >
              {i18n.why_we_ask_for_two_passwords}
            </Link>
          </PrfsIdSignInInputGuide>
        </PrfsIdSignInModuleInputArea>
        <PrfsIdSignInModuleBtnRow>
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
        </PrfsIdSignInModuleBtnRow>
      </Fade>
    </PrfsIdSignInInnerPadding>
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
