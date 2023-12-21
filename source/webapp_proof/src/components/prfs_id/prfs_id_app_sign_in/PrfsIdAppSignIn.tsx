"use client";

import React from "react";
import { PrfsIdCredential } from "@taigalabs/prfs-crypto-js";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  loadLocalPrfsIdCredentials,
  removeAllPrfsIdCredentials,
  StoredCredentialRecord,
} from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";

import styles from "./PrfsIdAppSignIn.module.scss";
import { i18nContext } from "@/i18n/context";
import PrfsIdSignInModule, {
  PrfsIdSignInForm,
  PrfsIdSignInModuleFooter,
} from "@/components/prfs_id/prfs_id_sign_in_module/PrfsIdSignInModule";
import { envs } from "@/envs";
import {
  IdCreateForm,
  makeEmptyIDCreateFormErrors,
  makeEmptyIdCreateForm,
} from "@/functions/validate_id";
import PrfsIdErrorDialog from "@/components/prfs_id/prfs_id_error_dialog/PrfsIdErrorDialog";
import Step1 from "./Step1";
import Step2 from "./Step2";
import StoredCredentials from "./StoredCredentials";
import PrfsIdSignIn from "../prfs_id_sign_in/PrfsIdSignIn";

enum SignInStep {
  // StoredCredentials,
  PrfsIdCredential,
  AppCredential,
}

export enum SignInStatus {
  Loading,
  Error,
  Standby,
}

const PrfsIdAppSignIn: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const [signInStatus, setSignInStatus] = React.useState(SignInStatus.Loading);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const searchParams = useSearchParams();
  const [formData, setFormData] = React.useState<IdCreateForm>(makeEmptyIdCreateForm());
  const [formErrors, setFormErrors] = React.useState<IdCreateForm>(makeEmptyIDCreateFormErrors());
  const [step, setStep] = React.useState(SignInStep.PrfsIdCredential);
  const [publicKey, setPublicKey] = React.useState<string | null>(null);
  const [appId, setAppId] = React.useState<string | null>(null);
  const [storedCredentials, setStoredCredentials] = React.useState<StoredCredentialRecord>({});
  const [credential, setCredential] = React.useState<PrfsIdCredential | null>(null);

  React.useEffect(() => {
    const publicKey = searchParams.get("public_key");
    const appId = searchParams.get("app_id");

    // const storedCredentials = loadLocalPrfsIdCredentials();
    // console.log("stored credentials", storedCredentials);
    // if (Object.keys(storedCredentials).length > 0) {
    //   setStep(SignInStep.StoredCredentials);
    //   setStoredCredentials(storedCredentials);
    // }

    if (!publicKey) {
      setSignInStatus(SignInStatus.Error);
      setErrorMsg("Invalid URL. 'public_key' is missing. Closing the window");
    } else if (!appId) {
      setSignInStatus(SignInStatus.Error);
      setErrorMsg("Invalid URL. 'app_id' is missing. Closing the window");
    } else {
      setPublicKey(publicKey);
      setAppId(appId);
      setSignInStatus(SignInStatus.Standby);
    }
  }, [
    searchParams,
    setSignInStatus,
    setErrorMsg,
    setPublicKey,
    setAppId,
    setStep,
    setStoredCredentials,
  ]);

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

  // const handleGotoStoredCredential = React.useCallback(() => {
  //   setStep(SignInStep.StoredCredentials);
  // }, [setStep]);

  const handleGotoPrfsIdCredential = React.useCallback(() => {
    setStep(SignInStep.PrfsIdCredential);
  }, [setStep]);

  const handleClickNext = React.useCallback(() => {
    setStep(SignInStep.AppCredential);
  }, [setStep]);

  const handleSucceedSignIn = React.useCallback((credential: PrfsIdCredential) => {
    console.log(11, credential);
  }, []);

  const content = React.useMemo(() => {
    if (!appId || !publicKey) {
      return null;
    }

    switch (step) {
      // case SignInStep.StoredCredentials: {
      //   return (
      //     <StoredCredentials
      //       setCredential={setCredential}
      //       storedCredentials={storedCredentials}
      //       appId={appId}
      //       handleClickUseAnotherId={handleGotoPrfsIdCredential}
      //       handleClickNext={handleClickNext}
      //       handleClickForgetAllCredentials={handleClickForgetAllCredentials}
      //     />
      //   );
      // }
      case SignInStep.PrfsIdCredential: {
        return <PrfsIdSignIn appId={appId} handleSucceedSignIn={handleSucceedSignIn} />;
        // return (
        //   <Step1
        //     setCredential={setCredential}
        //     errorMsg={errorMsg}
        //     formData={formData}
        //     setFormData={setFormData}
        //     formErrors={formErrors}
        //     handleClickNext={handleClickNext}
        //   />
        // );
      }
      case SignInStep.AppCredential: {
        return (
          credential && (
            <Step2
              credential={credential}
              appId={appId}
              publicKey={publicKey}
              formData={formData}
              setFormData={setFormData}
              formErrors={formErrors}
              // handleClickPrev={handleGotoStoredCredential}
            />
          )
        );
      }
      default:
        <div>Invalid step</div>;
    }
  }, [step, handleChangeValue, formErrors, publicKey, appId]);

  return (
    <PrfsIdSignInModule>
      <PrfsIdSignInForm>
        {signInStatus === SignInStatus.Loading && (
          <div className={styles.overlay}>
            <Spinner color="#1b62c0" />
          </div>
        )}
        {signInStatus === SignInStatus.Error && (
          <PrfsIdErrorDialog errorMsg={errorMsg} handleClose={handleCloseErrorDialog} />
        )}
        {content}
      </PrfsIdSignInForm>
      <PrfsIdSignInModuleFooter>
        <Link href={envs.NEXT_PUBLIC_CODE_REPOSITORY_URL}>
          <span>{i18n.code}</span>
        </Link>
        <Link href={envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}>
          <span>{i18n.prfs}</span>
        </Link>
      </PrfsIdSignInModuleFooter>
    </PrfsIdSignInModule>
  );
};

export default PrfsIdAppSignIn;
