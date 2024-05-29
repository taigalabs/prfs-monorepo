"use client";

import React from "react";
import { PrfsIdCredential } from "@taigalabs/prfs-id-sdk-web";

import styles from "./PrfsIdCreateID.module.scss";
import { i18nContext } from "@/i18n/context";
import { IdCreateForm, makeEmptyIDCreateFormErrors, makeEmptyIdCreateForm } from "@/identity";
// import CreateIdSummary from "./CreateIdSummary";
import SecretView from "./SecretView";
import InputPwForm from "./InputPwForm";

enum CreateIDStep {
  // InputId,
  Secret,
  InputPassword,
  // Secret,
  CreateIdSummary,
}

const CreateID: React.FC<CreateIDProps> = ({ handleClickSignIn, handleSucceedSignIn }) => {
  const i18n = React.useContext(i18nContext);
  const [formData, setFormData] = React.useState<IdCreateForm>(makeEmptyIdCreateForm());
  const [formErrors, setFormErrors] = React.useState<IdCreateForm>(makeEmptyIDCreateFormErrors());
  const [step, setStep] = React.useState(CreateIDStep.Secret);
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

  const handleGotoNext = React.useCallback(() => {
    setStep(s => s + 1);
    console.log(11);
  }, [formData, setFormErrors, setStep]);

  const handleGotoPrev = React.useCallback(() => {
    setStep(s => {
      return s > 0 ? s - 1 : s;
    });
  }, [setStep]);

  const content = React.useMemo(() => {
    switch (step) {
      case CreateIDStep.Secret: {
        return (
          <SecretView
            formData={formData}
            setFormData={setFormData}
            // formErrors={formErrors}
            // setFormErrors={setFormErrors}
            handleClickSignIn={handleClickSignIn}
            handleClickNext={handleGotoNext}
            // setCredential={setCredential}
          />
        );
      }
      case CreateIDStep.InputPassword: {
        return (
          <InputPwForm
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            // handleClickSignIn={handleClickSignIn}
            handleClickSignUp={handleGotoNext}
            setCredential={setCredential}
          />
        );
      }
      // case CreateIDStep.CreateIdSummary: {
      //   return (
      //     <CreateIdSummary
      //       credential={credential!}
      //       formData={formData}
      //       handleClickPrev={handleGotoPrev}
      //       handleClickSignIn={handleClickSignIn}
      //       handleSucceedSignIn={handleSucceedSignIn}
      //     />
      //   );
      // }
      default:
        <div>Invalid step</div>;
    }
  }, [step, handleGotoPrev, handleGotoNext, handleChangeValue, formErrors]);

  return <>{content}</>;
};

export default CreateID;

export interface CreateIDProps {
  handleClickSignIn: () => void;
  handleSucceedSignIn: (credential: PrfsIdCredential) => void;
}
