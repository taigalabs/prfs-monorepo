"use client";

import React from "react";
import { PrfsIdCredential, parseAppSignInSearchParams } from "@taigalabs/prfs-id-sdk-web";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";

import styles from "./PrfsIdAppSignIn.module.scss";
import { i18nContext } from "@/i18n/context";
import PrfsIdSignInModule, {
  PrfsIdSignInForm,
  PrfsIdSignInModuleFooter,
} from "@/components/prfs_id/prfs_id_sign_in_module/PrfsIdSignInModule";
import { envs } from "@/envs";
import PrfsIdErrorDialog from "@/components/prfs_id/prfs_id_error_dialog/PrfsIdErrorDialog";
import PrfsIdSignIn from "@/components/prfs_id/prfs_id_sign_in/PrfsIdSignIn";
import AppCredential from "./AppCredential";

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
        setSignInStatus(SignInStatus.Standby);
      }
    }

    const listener = (ev: MessageEvent<any>) => {
      console.log(11, ev.origin, ev.data);
      // const { origin } = ev;
      // if (endpoint.startsWith(origin)) {
      //   const data = ev.data as PrfsIdMsg<Buffer>;
      //   if (data.type === "SIGN_IN_SUCCESS") {
      //     if (closeTimerRef.current) {
      //       clearInterval(closeTimerRef.current);
      //     }

      //     const msg = newPrfsIdMsg("SIGN_IN_SUCCESS_RESPOND", null);
      //     ev.ports[0].postMessage(msg);
      //     handleSucceedSignIn(data.payload);
      //   }
      // }
    };
    console.log("register");
    window.addEventListener("message", listener, false);
  }, [appSignInArgs, setSignInStatus, setErrorMsg, setStep]);

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
            />
          )
        );
      }
      default:
        <div>Invalid step</div>;
    }
  }, [step, appSignInArgs]);

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
