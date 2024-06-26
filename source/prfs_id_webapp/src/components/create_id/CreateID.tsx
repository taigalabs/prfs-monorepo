"use client";

import React from "react";
import { PrfsIdCredential } from "@taigalabs/prfs-id-sdk-web";

import styles from "./PrfsIdCreateID.module.scss";
import { i18nContext } from "@/i18n/context";
import { IdCreateForm, makeEmptyIDCreateFormErrors, makeEmptyIdCreateForm } from "@/identity";
import CreateIdSummary from "./CreateIdSummary";
import CreateIdForm from "./CreateIdForm";

enum CreateIDStep {
  CreateIdForm,
  CreateIdSummary,
}

const CreateID: React.FC<CreateIDProps> = ({ handleClickSignIn, handleSucceedSignIn }) => {
  const i18n = React.useContext(i18nContext);
  const [formData, setFormData] = React.useState<IdCreateForm>(makeEmptyIdCreateForm());
  const [formErrors, setFormErrors] = React.useState<IdCreateForm>(makeEmptyIDCreateFormErrors());
  const [step, setStep] = React.useState(CreateIDStep.CreateIdForm);
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
    setStep(CreateIDStep.CreateIdSummary);
  }, [formData, setFormErrors, setStep]);

  const handleGotoInputCredential = React.useCallback(() => {
    setStep(CreateIDStep.CreateIdForm);
  }, [setStep]);

  const content = React.useMemo(() => {
    switch (step) {
      case CreateIDStep.CreateIdForm: {
        return (
          <CreateIdForm
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            handleClickSignIn={handleClickSignIn}
            handleClickNext={handleGotoCreateIdSuccess}
            setCredential={setCredential}
          />
        );
      }
      case CreateIDStep.CreateIdSummary: {
        return (
          credential && (
            <CreateIdSummary
              credential={credential}
              formData={formData}
              handleClickPrev={handleGotoInputCredential}
              handleClickSignIn={handleClickSignIn}
              handleSucceedSignIn={handleSucceedSignIn}
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

export default CreateID;

export interface CreateIDProps {
  handleClickSignIn: () => void;
  handleSucceedSignIn: (credential: PrfsIdCredential) => void;
}
