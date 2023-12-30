"use client";

import React from "react";
import { PrfsIdCredential, parseAppSignInSearchParams } from "@taigalabs/prfs-id-sdk-web";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";

import styles from "./PrfsIdAppSignIn.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  SignInModule,
  SignInForm,
  SignInModuleFooter,
} from "@/components/sign_in_module/SignInModule";
import { envs } from "@/envs";
import PrfsIdErrorDialog from "@/components/error_dialog/PrfsIdErrorDialog";
import PrfsIdSignIn from "@/components/sign_in/PrfsIdSignIn";
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

const PrfsIdAppSignIn: React.FC = () => {
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
  const { prfsEmbedRef, isReady: isPrfsReady } = usePrfsEmbed({
    appId: "prfs_id",
    prfsEmbedEndpoint: envs.NEXT_PUBLIC_PRFS_EMBED_WEBAPP_ENDPOINT,
  });

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
        return (
          <PrfsIdSignIn appId={appSignInArgs.appId} handleSucceedSignIn={handleSucceedSignIn} />
        );
      }
      case SignInStep.AppCredential: {
        return (
          credential &&
          appSignInArgs && (
            <AppCredential
              credential={credential}
              appSignInArgs={appSignInArgs}
              handleClickPrev={handleClickPrev}
              prfsEmbedRef={prfsEmbedRef}
            />
          )
        );
      }
      default:
        <div>Invalid step</div>;
    }
  }, [step, appSignInArgs]);

  return (
    <SignInModule>
      <SignInForm>
        {signInStatus === SignInStatus.Loading && (
          <div className={styles.overlay}>
            <Spinner color="#1b62c0" />
          </div>
        )}
        {signInStatus === SignInStatus.Error && (
          <PrfsIdErrorDialog errorMsg={errorMsg} handleClose={handleCloseErrorDialog} />
        )}
        {content}
      </SignInForm>
      <SignInModuleFooter>
        <Link href={envs.NEXT_PUBLIC_CODE_REPOSITORY_URL}>
          <span>{i18n.code}</span>
        </Link>
        <Link href={envs.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}>
          <span>{i18n.prfs}</span>
        </Link>
      </SignInModuleFooter>
    </SignInModule>
  );
};

export default PrfsIdAppSignIn;
