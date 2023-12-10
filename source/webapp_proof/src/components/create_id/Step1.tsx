"use client";

import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Link from "next/link";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";

import styles from "./Step1.module.scss";
import { i18nContext } from "@/contexts/i18n";
import SignInModule, {
  SignInForm,
  SignInInputGuide,
  SignInInputItem,
  SignInModuleBtnRow,
  SignInModuleFooter,
  SignInModuleHeader,
  SignInModuleInputArea,
  SignInModuleLogoArea,
  SignInModuleSubtitle,
  SignInModuleTitle,
} from "@/components/sign_in_module/SignInModule";
import { paths } from "@/paths";
import {
  IdCreateForm,
  makeEmptyIDCreateFormErrors,
  makeEmptyIdCreateForm,
  validateIdCreateForm,
} from "@/functions/validate_id";
import { envs } from "@/envs";

// enum CreateIDStep {
//   InputCredential,
//   CreateIdSuccess,
// }

const Step1: React.FC<Step1Props> = ({
  formData,
  setFormData,
  // formErrors,
  handleClickPrev,
  handleClickNext,
}) => {
  const i18n = React.useContext(i18nContext);
  const [formErrors, setFormErrors] = React.useState<IdCreateForm>(makeEmptyIDCreateFormErrors());
  // const [step, setStep] = React.useState(CreateIDStep.InputCredential);

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

  return (
    <div>
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
            <Link href={`${process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}/zauth`} target="_blank">
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
            <Link href={`${process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}/zauth`} target="_blank">
              {i18n.why_we_ask_for_two_passwords}
            </Link>
          </SignInInputGuide>
        </SignInModuleInputArea>
        <SignInModuleBtnRow>
          <Button
            type="button"
            variant="transparent_blue_2"
            noTransition
            handleClick={handleClickPrev}
            noShadow
          >
            <Link href={paths.accounts__signin} tabIndex={-1}>
              {i18n.already_have_id}
            </Link>
          </Button>
          <Button
            type="button"
            variant="blue_2"
            className={styles.nextBtn}
            noTransition
            handleClick={handleClickNext}
            noShadow
          >
            {i18n.next}
          </Button>
        </SignInModuleBtnRow>
      </Fade>
    </div>
  );
};

export default Step1;

export interface Step1Props {
  formData: IdCreateForm;
  setFormData: React.Dispatch<React.SetStateAction<IdCreateForm>>;
  // formErrors: IdCreateForm;
  handleClickNext: () => void;
  handleClickPrev: () => void;
}
