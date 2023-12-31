"use client";

import React from "react";
import {
  CommitmentArgs,
  loadLocalPrfsIdCredentials,
  PrfsIdCredential,
  removeAllPrfsIdCredentials,
  StoredCredentialRecord,
} from "@taigalabs/prfs-id-sdk-web";

import styles from "./SignIn.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  IdCreateForm,
  makeEmptyIDCreateFormErrors,
  makeEmptyIdCreateForm,
} from "@/functions/validate_id";
import InputCredential from "./InputCredential";
import StoredCredentials from "./StoredCredentials";
import CreateID from "@/components/create_id/CreateID";

enum SignInStep {
  CreateID,
  StoredCredentials,
  InputCredential,
}

export enum SignInStatus {
  Loading,
  Error,
  Standby,
}

const SignIn: React.FC<PrfsIdSignInProps> = ({ handleSucceedSignIn, appId }) => {
  const i18n = React.useContext(i18nContext);
  const [signInStatus, setSignInStatus] = React.useState(SignInStatus.Loading);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<IdCreateForm>(makeEmptyIdCreateForm());
  const [formErrors, setFormErrors] = React.useState<IdCreateForm>(makeEmptyIDCreateFormErrors());
  const [step, setStep] = React.useState(SignInStep.InputCredential);
  const [storedCredentials, setStoredCredentials] = React.useState<StoredCredentialRecord>({});

  React.useEffect(() => {
    const storedCredentials = loadLocalPrfsIdCredentials();
    console.log("stored credentials", storedCredentials);

    if (Object.keys(storedCredentials).length > 0) {
      setStep(SignInStep.StoredCredentials);
      setStoredCredentials(storedCredentials);
    }
  }, [setSignInStatus, setErrorMsg, setStep, setStoredCredentials]);

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

  const handleClickForgetAllCredentials = React.useCallback(() => {
    removeAllPrfsIdCredentials();
    setStoredCredentials({});
    setStep(SignInStep.InputCredential);
  }, [setStep, setStoredCredentials]);

  const handleClickCreateID = React.useCallback(() => {
    setStep(SignInStep.CreateID);
  }, [setStep]);

  const handleGotoPrfsIdCredential = React.useCallback(() => {
    setStep(SignInStep.InputCredential);
  }, [setStep]);

  const handleClickSignIn = React.useCallback(() => {
    setStep(SignInStep.InputCredential);
  }, [setStep]);

  const content = React.useMemo(() => {
    switch (step) {
      case SignInStep.StoredCredentials: {
        return (
          <StoredCredentials
            storedCredentials={storedCredentials}
            appId={appId}
            handleClickUseAnotherId={handleGotoPrfsIdCredential}
            handleSucceedSignIn={handleSucceedSignIn}
            handleClickForgetAllCredentials={handleClickForgetAllCredentials}
          />
        );
      }
      case SignInStep.InputCredential: {
        return (
          <InputCredential
            errorMsg={errorMsg}
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            handleSucceedSignIn={handleSucceedSignIn}
            handleClickCreateID={handleClickCreateID}
          />
        );
      }
      case SignInStep.CreateID: {
        return (
          <CreateID
            handleClickSignIn={handleClickSignIn}
            handleSucceedCreateId={handleSucceedSignIn}
          />
        );
      }
      default:
        <div>Invalid step</div>;
    }
  }, [step, handleChangeValue, formErrors]);

  return <>{content}</>;
};

export default SignIn;

export interface PrfsIdSignInProps {
  handleSucceedSignIn: (credential: PrfsIdCredential) => void;
  appId: string;
}
