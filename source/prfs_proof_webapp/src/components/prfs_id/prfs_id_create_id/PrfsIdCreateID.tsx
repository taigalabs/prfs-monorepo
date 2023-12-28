"use client";

import React from "react";
import { PrfsIdCredential } from "@taigalabs/prfs-id-sdk-web";

import styles from "./PrfsIdCreateID.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  IdCreateForm,
  makeEmptyIDCreateFormErrors,
  makeEmptyIdCreateForm,
  validateIdCreateForm,
} from "@/functions/validate_id";
import SignUp from "./SignUp";
import InputCreateIdCredential from "./InputCreateIdCredential";

enum CreateIDStep {
  InputCreateIdCredential,
  SignUp,
}

const PrfsIdCreateID: React.FC<PrfsIdCreateIDProps> = ({
  handleClickSignIn,
  handleSucceedCreateId,
}) => {
  const i18n = React.useContext(i18nContext);
  const [formData, setFormData] = React.useState<IdCreateForm>(makeEmptyIdCreateForm());
  const [formErrors, setFormErrors] = React.useState<IdCreateForm>(makeEmptyIDCreateFormErrors());
  const [step, setStep] = React.useState(CreateIDStep.InputCreateIdCredential);
  const [credential, setCredential] = React.useState<PrfsIdCredential | null>(null);

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

  const handleGotoCreateIdSuccess = React.useCallback(() => {
    const res = validateIdCreateForm(formData, setFormErrors);

    if (res) {
      setStep(CreateIDStep.SignUp);
    }
  }, [formData, setFormErrors, setStep]);

  const handleGotoInputCredential = React.useCallback(() => {
    setStep(CreateIDStep.InputCreateIdCredential);
  }, [setStep]);

  const content = React.useMemo(() => {
    switch (step) {
      case CreateIDStep.InputCreateIdCredential: {
        return (
          <InputCreateIdCredential
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            handleClickSignIn={handleClickSignIn}
            handleClickNext={handleGotoCreateIdSuccess}
            setCredential={setCredential}
          />
        );
      }
      case CreateIDStep.SignUp: {
        return (
          credential && (
            <SignUp
              credential={credential}
              formData={formData}
              handleClickPrev={handleGotoInputCredential}
              handleClickSignIn={handleClickSignIn}
              handleSucceedCreateId={handleSucceedCreateId}
            />
          )
        );
      }
      default:
        <div>Invalid step</div>;
    }
  }, [step, handleGotoInputCredential, handleGotoCreateIdSuccess, handleChangeValue, formErrors]);

  return <>{content}</>;
};

export default PrfsIdCreateID;

export interface PrfsIdCreateIDProps {
  handleClickSignIn: () => void;
  handleSucceedCreateId: (credential: PrfsIdCredential) => void;
}
