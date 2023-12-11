"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./PrfsIdCreateID.module.scss";
import { i18nContext } from "@/contexts/i18n";
import PrfsIdSignInModule, {
  PrfsIdSignInForm,
  PrfsIdSignInModuleFooter,
} from "@/components/prfs_id_sign_in_module/PrfsIdSignInModule";
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

const PrfsIdCreateID: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
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

  const handleClickSignIn = React.useCallback(() => {
    const { search } = window.location;
    const url = `${paths.id__signin}${search}`;
    router.push(url);
  }, [router]);

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
            handleClickSignIn={handleClickSignIn}
            handleClickPrev={handleClickPrev}
            handleClickNext={handleClickNext}
          />
        );
      }
      case CreateIDStep.CreateIdSuccess: {
        return (
          <Step2
            formData={formData}
            handleClickPrev={handleClickPrev}
            handleClickSignIn={handleClickSignIn}
          />
        );
      }
      default:
        <div>Invalid step</div>;
    }
  }, [step, handleClickNext, handleChangeValue, formErrors]);

  return (
    <PrfsIdSignInModule>
      <PrfsIdSignInForm>{content}</PrfsIdSignInForm>
      <PrfsIdSignInModuleFooter>
        <Link className={styles.prfsLink} href={envs.NEXT_PUBLIC_CODE_REPOSITORY_URL}>
          <span>{i18n.code}</span>
        </Link>
        <Link className={styles.prfsLink} href={envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}>
          <span>{i18n.prfs}</span>
        </Link>
      </PrfsIdSignInModuleFooter>
    </PrfsIdSignInModule>
  );
};

export default PrfsIdCreateID;
