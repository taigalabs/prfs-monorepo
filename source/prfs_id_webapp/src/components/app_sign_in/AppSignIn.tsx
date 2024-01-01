"use client";

import React from "react";
import { PrfsIdCredential, parseAppSignInSearchParams } from "@taigalabs/prfs-id-sdk-web";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";

import styles from "./AppSignIn.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  DefaultModule,
  DefaultForm,
  DefaultModuleFooter,
} from "@/components/default_module/DefaultModule";
import { envs } from "@/envs";
import PrfsIdErrorDialog from "@/components/error_dialog/PrfsIdErrorDialog";
import SignIn from "@/components/sign_in/SignIn";
import AppCredential from "./AppCredential";
import { usePrfsEmbed } from "@taigalabs/prfs-id-sdk-react";

enum SignInStep {
  PrfsIdCredential,
  AppCredential,
}

export enum SignInStatus {
  Loading,
  Error,
  Standby,
}

const AppSignIn: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const [signInStatus, setSignInStatus] = React.useState(SignInStatus.Loading);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const searchParams = useSearchParams();
  const [step, setStep] = React.useState(SignInStep.PrfsIdCredential);
  const [credential, setCredential] = React.useState<PrfsIdCredential | null>(null);
  const appSignInArgs = React.useMemo(() => {
    try {
      const args = parseAppSignInSearchParams(searchParams as URLSearchParams);
      return args;
    } catch (err) {
      return null;
    }
  }, [searchParams]);
  const { prfsEmbed, isReady: isPrfsReady } = usePrfsEmbed();

  React.useEffect(() => {
    if (appSignInArgs) {
      const { publicKey, appId } = appSignInArgs;

      if (!publicKey) {
        setSignInStatus(SignInStatus.Error);
        setErrorMsg("Invalid URL. 'public_key' is missing. Closing the window");
      } else if (!appId) {
        setSignInStatus(SignInStatus.Error);
        setErrorMsg("Invalid URL. 'app_id' is missing. Closing the window");
      } else {
        if (isPrfsReady) {
          setSignInStatus(SignInStatus.Standby);
        }
      }
    }
  }, [appSignInArgs, setSignInStatus, setErrorMsg, setStep, isPrfsReady]);

  const handleCloseErrorDialog = React.useCallback(() => {
    window.close();
  }, []);

  const handleClickPrev = React.useCallback(() => {
    setStep(SignInStep.PrfsIdCredential);
  }, [setStep]);

  const handleSucceedSignIn = React.useCallback(
    (credential: PrfsIdCredential) => {
      if (credential) {
        setCredential(credential);
        setStep(SignInStep.AppCredential);
      }
    },
    [setCredential, setStep],
  );

  const content = React.useMemo(() => {
    if (!appSignInArgs) {
      return null;
    }

    switch (step) {
      case SignInStep.PrfsIdCredential: {
        return <SignIn appId={appSignInArgs.appId} handleSucceedSignIn={handleSucceedSignIn} />;
      }
      case SignInStep.AppCredential: {
        return (
          credential &&
          appSignInArgs && (
            <AppCredential
              credential={credential}
              appSignInArgs={appSignInArgs}
              handleClickPrev={handleClickPrev}
              prfsEmbed={prfsEmbed}
            />
          )
        );
      }
      default:
        <div>Invalid step</div>;
    }
  }, [step, appSignInArgs]);

  return (
    <DefaultModule>
      <DefaultForm>
        {signInStatus === SignInStatus.Loading && (
          <div className={styles.overlay}>
            <Spinner color="#1b62c0" />
          </div>
        )}
        {signInStatus === SignInStatus.Error && (
          <PrfsIdErrorDialog errorMsg={errorMsg} handleClose={handleCloseErrorDialog} />
        )}
        {content}
      </DefaultForm>
      <DefaultModuleFooter>
        <Link href={envs.NEXT_PUBLIC_CODE_REPOSITORY_URL}>
          <span>{i18n.code}</span>
        </Link>
        <Link href={envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}>
          <span>{i18n.prfs}</span>
        </Link>
      </DefaultModuleFooter>
    </DefaultModule>
  );
};

export default AppSignIn;
