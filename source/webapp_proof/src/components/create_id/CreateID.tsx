"use client";

import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Link from "next/link";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";

import styles from "./CreateID.module.scss";
import { i18nContext } from "@/contexts/i18n";
import SignInModule, {
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
  IdForm,
  makeEmptyIDFormErrors,
  makeEmptyIdForm,
  validateIdForm,
} from "@/functions/validate_id";
import Step2 from "./Step2";
import { envs } from "@/envs";

enum CreateIDStep {
  InputCredential,
  CreateIdSuccess,
}

const CreateID: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  const [formData, setFormData] = React.useState<IdForm>(makeEmptyIdForm());
  const [formErrors, setFormErrors] = React.useState<IdForm>(makeEmptyIDFormErrors());
  const [step, setStep] = React.useState(CreateIDStep.InputCredential);

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

  const handleClickNext = React.useCallback(() => {
    const res = validateIdForm(formData, setFormErrors);

    if (res) {
      setStep(CreateIDStep.CreateIdSuccess);
    }
  }, [formData, setFormErrors, setStep]);

  const handleClickPrev = React.useCallback(() => {
    setStep(CreateIDStep.InputCredential);
  }, [setStep]);

  const content = React.useMemo(() => {
    switch (step) {
      case CreateIDStep.InputCredential: {
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
                  <Link
                    href={`${process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}/zauth`}
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
                    href={`${process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}/zauth`}
                    target="_blank"
                  >
                    {i18n.why_we_ask_for_two_passwords}
                  </Link>
                </SignInInputGuide>
              </SignInModuleInputArea>
              <SignInModuleBtnRow>
                <Link href={paths.accounts__signin} className={styles.blueLink}>
                  {i18n.already_have_id}
                </Link>
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
      }
      case CreateIDStep.CreateIdSuccess: {
        return <Step2 formData={formData} handleClickPrev={handleClickPrev} />;
      }
      default:
        <div>Invalid step</div>;
    }
  }, [step, handleClickNext, handleChangeValue, formErrors]);

  return (
    <>
      <div className={styles.moduleWrapper}>
        <SignInModule>{content}</SignInModule>
      </div>
      <SignInModuleFooter>
        <Link className={styles.prfsLink} href={envs.NEXT_PUBLIC_CODE_REPOSITORY_URL}>
          <span>{i18n.code}</span>
        </Link>
        <Link className={styles.prfsLink} href={envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}>
          <span>{i18n.prfs}</span>
        </Link>
      </SignInModuleFooter>
    </>
  );
};

export default CreateID;
