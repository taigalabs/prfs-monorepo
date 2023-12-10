"use client";

import React from "react";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Link from "next/link";
import Fade from "@taigalabs/prfs-react-components/src/fade/Fade";
import { useSearchParams } from "next/navigation";

import styles from "./CreateID.module.scss";
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
import Step1 from "./Step1";
import Step2 from "./Step2";
import { envs } from "@/envs";

enum CreateIDStep {
  InputCredential,
  CreateIdSuccess,
}

const CreateID: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const [formData, setFormData] = React.useState<IdCreateForm>(makeEmptyIdCreateForm());
  const [formErrors, setFormErrors] = React.useState<IdCreateForm>(makeEmptyIDCreateFormErrors());
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
    const res = validateIdCreateForm(formData, setFormErrors);

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
          <Step1
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            handleClickPrev={handleClickPrev}
            handleClickNext={handleClickNext}
          />
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
    <SignInModule>
      <SignInForm>{content}</SignInForm>
      <SignInModuleFooter>
        <Link className={styles.prfsLink} href={envs.NEXT_PUBLIC_CODE_REPOSITORY_URL}>
          <span>{i18n.code}</span>
        </Link>
        <Link className={styles.prfsLink} href={envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}>
          <span>{i18n.prfs}</span>
        </Link>
      </SignInModuleFooter>
    </SignInModule>
  );
};

export default CreateID;
