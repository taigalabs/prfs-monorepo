"use client";

import React from "react";
import { initWasm, makeCredential } from "@taigalabs/prfs-crypto-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  sendMsgToOpener,
  type PrfsIdSignInSuccessMsg,
  loadLocalPrfsIdCredentials,
  StoredCredential,
} from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { encrypt, decrypt, PrivateKey, PublicKey } from "eciesjs";
import { secp256k1 as secp } from "@noble/curves/secp256k1";

import styles from "./PrfsIdSignIn.module.scss";
import { i18nContext } from "@/contexts/i18n";
import PrfsIdSignInModule, {
  PrfsIdSignInForm,
  PrfsIdSignInModuleBtnRow,
  PrfsIdSignInModuleFooter,
  PrfsIdSignInModuleHeader,
  PrfsIdSignInModuleInputArea,
  PrfsIdSignInModuleLogoArea,
  PrfsIdSignInModuleSubtitle,
  PrfsIdSignInModuleTitle,
} from "@/components/prfs_id_sign_in_module/PrfsIdSignInModule";
import { paths } from "@/paths";
import { envs } from "@/envs";
import {
  IdCreateForm,
  makeEmptyIDCreateFormErrors,
  makeEmptyIdCreateForm,
} from "@/functions/validate_id";
import ErrorDialog from "./ErrorDialog";
import Step1 from "./Step1";
import Step2 from "./Step2";
import StoredCredentials from "./StoredCredentials";

enum SignInStep {
  StoredCredentials,
  PrfsIdCredential,
  AppCredential,
}

export enum SignInStatus {
  Loading,
  Error,
  Standby,
}

const PrfsIdSignIn: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();
  const [signInStatus, setSignInStatus] = React.useState(SignInStatus.Loading);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const searchParams = useSearchParams();
  const [formData, setFormData] = React.useState<IdCreateForm>(makeEmptyIdCreateForm());
  const [formErrors, setFormErrors] = React.useState<IdCreateForm>(makeEmptyIDCreateFormErrors());
  const [step, setStep] = React.useState(SignInStep.PrfsIdCredential);
  const [publicKey, setPublicKey] = React.useState<string | null>(null);
  const [appId, setAppId] = React.useState<string | null>(null);
  const [storedCredentials, setStoredCredentials] = React.useState<StoredCredential[]>([]);

  React.useEffect(() => {
    const publicKey = searchParams.get("public_key");
    const appId = searchParams.get("app_id");

    const storedCredentials = loadLocalPrfsIdCredentials();
    console.log("stored credentials", storedCredentials);
    if (storedCredentials.length > 0) {
      setStep(SignInStep.StoredCredentials);
      setStoredCredentials(storedCredentials);
    }

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

  const handleClickPrev = React.useCallback(() => {
    setStep(SignInStep.PrfsIdCredential);
  }, [setStep]);

  const handleClickNext = React.useCallback(() => {
    setStep(SignInStep.AppCredential);
  }, [setStep]);

  const content = React.useMemo(() => {
    if (!appId || !publicKey) {
      return null;
    }

    switch (step) {
      case SignInStep.StoredCredentials: {
        return (
          <StoredCredentials
            storedCredentials={storedCredentials}
            appId={appId}
            handleClickUseAnotherId={handleClickPrev}
            handleClickNext={handleClickNext}
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
            handleClickNext={handleClickNext}
          />
        );
      }
      case SignInStep.AppCredential: {
        return (
          <Step2
            appId={appId}
            publicKey={publicKey}
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            handleClickPrev={handleClickPrev}
          />
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
          <ErrorDialog errorMsg={errorMsg} handleClose={handleCloseErrorDialog} />
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

export default PrfsIdSignIn;
