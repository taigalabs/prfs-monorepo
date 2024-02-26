"use client";

import React from "react";
import {
  AppSignInQuery,
  PrfsIdCredential,
  parseAppSignInSearchParams,
} from "@taigalabs/prfs-id-sdk-web";
import { useSearchParams } from "next/navigation";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";

import styles from "./AppSignIn.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  DefaultModule,
  DefaultForm,
  DefaultModuleFooter,
  DefaultTopLabel,
} from "@/components/default_module/DefaultModule";
import { envs } from "@/envs";
import PrfsIdErrorDialog from "@/components/error_dialog/PrfsIdErrorDialog";
import SignIn from "@/components/sign_in/SignIn";
import AppCredential from "./AppCredential";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import { ProofGenReceiptRaw } from "@/components/proof_gen/receipt";

enum SignInStep {
  PrfsIdCredential,
  AppCredential,
}

export enum SignInStatus {
  Loading,
  Error,
  Standby,
}

const AppSignIn: React.FC<AppSignInProps> = ({}) => {
  const i18n = React.useContext(i18nContext);
  const [signInStatus, setSignInStatus] = React.useState(SignInStatus.Loading);
  const [errorDialogMsg, setErrorDialogMsg] = React.useState<React.ReactNode | null>(null);
  const searchParams = useSearchParams();
  const [step, setStep] = React.useState(SignInStep.PrfsIdCredential);
  const [credential, setCredential] = React.useState<PrfsIdCredential | null>(null);
  const appSignInArgs = React.useMemo(() => {
    try {
      const args = parseAppSignInSearchParams(searchParams as URLSearchParams);
      return args;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, [searchParams]);

  React.useEffect(() => {
    if (appSignInArgs) {
      const { public_key, app_id } = appSignInArgs;

      if (!public_key) {
        setSignInStatus(SignInStatus.Error);
        setErrorDialogMsg("Invalid URL. 'public_key' is missing. Closing the window");
      } else if (!app_id) {
        setSignInStatus(SignInStatus.Error);
        setErrorDialogMsg("Invalid URL. 'app_id' is missing. Closing the window");
      } else {
        setSignInStatus(SignInStatus.Standby);
      }
    }
  }, [appSignInArgs, setSignInStatus, setErrorDialogMsg, setStep]);

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
        return <SignIn appId={appSignInArgs.app_id} handleSucceedSignIn={handleSucceedSignIn} />;
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
    <DefaultModule>
      <DefaultForm>
        {signInStatus === SignInStatus.Loading && (
          <div className={styles.overlay}>
            <Spinner color="#1b62c0" />
          </div>
        )}
        {signInStatus === SignInStatus.Error && (
          <PrfsIdErrorDialog errorMsg={errorDialogMsg} handleClose={handleCloseErrorDialog} />
        )}
        <DefaultTopLabel>{i18n.sign_in_with_prfs_id}</DefaultTopLabel>
        {content}
      </DefaultForm>
      <DefaultModuleFooter>
        <GlobalFooter />
      </DefaultModuleFooter>
    </DefaultModule>
  );
};

export default AppSignIn;

export interface AppSignInProps {
  credential: PrfsIdCredential;
  query: AppSignInQuery;
  setReceipt: React.Dispatch<React.SetStateAction<ProofGenReceiptRaw | null>>;
}
