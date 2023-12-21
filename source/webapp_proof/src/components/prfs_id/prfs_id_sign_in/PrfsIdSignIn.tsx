"use client";

import React from "react";
import { PrfsIdCredential } from "@taigalabs/prfs-crypto-js";
import Link from "next/link";
import {
  loadLocalPrfsIdCredentials,
  removeAllPrfsIdCredentials,
  StoredCredentialRecord,
} from "@taigalabs/prfs-id-sdk-web";

import styles from "./PrfsIdSignIn.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  IdCreateForm,
  makeEmptyIDCreateFormErrors,
  makeEmptyIdCreateForm,
} from "@/functions/validate_id";
import Step1 from "./Step1";
import StoredCredentials from "./StoredCredentials";

enum SignInStep {
  StoredCredentials,
  PrfsIdCredential,
  // AppCredential,
}

export enum SignInStatus {
  Loading,
  Error,
  Standby,
}

const PrfsIdSignIn: React.FC<PrfsIdSignInProps> = ({ handleSucceedSignIn, appId }) => {
  const i18n = React.useContext(i18nContext);
  const [signInStatus, setSignInStatus] = React.useState(SignInStatus.Loading);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<IdCreateForm>(makeEmptyIdCreateForm());
  const [formErrors, setFormErrors] = React.useState<IdCreateForm>(makeEmptyIDCreateFormErrors());
  const [step, setStep] = React.useState(SignInStep.PrfsIdCredential);
  const [storedCredentials, setStoredCredentials] = React.useState<StoredCredentialRecord>({});
  // const [credential, setCredential] = React.useState<PrfsIdCredential | null>(null);

  React.useEffect(() => {
    const storedCredentials = loadLocalPrfsIdCredentials();
    console.log("stored credentials", storedCredentials);

    if (Object.keys(storedCredentials).length > 0) {
      setStep(SignInStep.StoredCredentials);
      setStoredCredentials(storedCredentials);
    }
  }, [setSignInStatus, setErrorMsg, setStep, setStoredCredentials]);

  const handleCloseErrorDialog = React.useCallback(() => {
    window.close();
  }, []);

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
    setStep(SignInStep.PrfsIdCredential);
  }, [setStep, setStoredCredentials]);

  const handleGotoStoredCredential = React.useCallback(() => {
    setStep(SignInStep.StoredCredentials);
  }, [setStep]);

  const handleGotoPrfsIdCredential = React.useCallback(() => {
    setStep(SignInStep.PrfsIdCredential);
  }, [setStep]);

  // const handleClickNext = React.useCallback(() => {
  //   setStep(SignInStep.AppCredential);
  // }, [setStep]);

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
      case SignInStep.PrfsIdCredential: {
        return (
          <Step1
            errorMsg={errorMsg}
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            handleSucceedSignIn={handleSucceedSignIn}
          />
        );
      }
      default:
        <div>Invalid step</div>;
    }
  }, [step, handleChangeValue, formErrors]);

  return <>{content}</>;
};

export default PrfsIdSignIn;

export interface PrfsIdSignInProps {
  handleSucceedSignIn: (credential: PrfsIdCredential) => void;
  appId: string;
}
