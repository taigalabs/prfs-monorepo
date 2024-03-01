"use client";

import React from "react";
import { PrfsIdCredential } from "@taigalabs/prfs-id-sdk-web";

import styles from "./SignIn.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  IdCreateForm,
  makeEmptyIDCreateFormErrors,
  makeEmptyIdCreateForm,
} from "@/functions/validate_id";
import CreateID from "@/components/create_id/CreateID";
import StoredCredentials from "./StoredCredentials";
import SignInForm from "./SignInForm";
import {
  StoredCredentialRecord,
  loadLocalPrfsIdCredentials,
  removeAllPrfsIdCredentials,
} from "@/storage/prfs_id_credential";

enum SignInStep {
  Loading,
  CreateID,
  StoredCredentials,
  SignInForm,
}

export enum SignInStatus {
  InProgress,
  Standby,
}

const SignIn: React.FC<PrfsIdSignInProps> = ({ handleSucceedSignIn, appId }) => {
  const i18n = React.useContext(i18nContext);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<IdCreateForm>(makeEmptyIdCreateForm());
  const [formErrors, setFormErrors] = React.useState<IdCreateForm>(makeEmptyIDCreateFormErrors());
  const [step, setStep] = React.useState(SignInStep.Loading);
  const [storedCredentials, setStoredCredentials] = React.useState<StoredCredentialRecord>({});

  React.useEffect(() => {
    const storedCredentials = loadLocalPrfsIdCredentials();
    console.log("stored credentials", storedCredentials);

    if (Object.keys(storedCredentials).length > 0) {
      setStep(SignInStep.StoredCredentials);
      setStoredCredentials(storedCredentials);
    } else {
      setStep(SignInStep.SignInForm);
    }
  }, [setErrorMsg, setStep, setStoredCredentials]);

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
    setStep(SignInStep.SignInForm);
  }, [setStep, setStoredCredentials]);

  const handleClickCreateID = React.useCallback(() => {
    setStep(SignInStep.CreateID);
  }, [setStep]);

  const handleGotoPrfsIdCredential = React.useCallback(() => {
    setStep(SignInStep.SignInForm);
  }, [setStep]);

  const handleClickStoredCredential = React.useCallback(() => {
    setStep(SignInStep.StoredCredentials);
  }, [setStep]);

  const handleClickSignIn = React.useCallback(() => {
    setStep(SignInStep.SignInForm);
  }, [setStep]);

  const content = React.useMemo(() => {
    switch (step) {
      case SignInStep.Loading: {
        return <div className={styles.loading}>Loading...</div>;
      }
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
      case SignInStep.SignInForm: {
        return (
          <SignInForm
            errorMsg={errorMsg}
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            handleSucceedSignIn={handleSucceedSignIn}
            handleClickCreateID={handleClickCreateID}
            handleClickStoredCredential={handleClickStoredCredential}
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
