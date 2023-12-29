"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { PrfsIdCredential } from "@taigalabs/prfs-id-sdk-web";

import styles from "./PrfsIdCommitment.module.scss";
import { i18nContext } from "@/i18n/context";
import PrfsIdSignInModule, {
  PrfsIdSignInForm,
  PrfsIdSignInModuleFooter,
} from "@/components/sign_in_module/PrfsIdSignInModule";
import { envs } from "@/envs";
import PrfsIdErrorDialog from "@/components/error_dialog/PrfsIdErrorDialog";
import PrfsIdSignIn from "@/components/sign_in/PrfsIdSignIn";
import Commitments from "./Commitments";

enum CommitmentStep {
  PrfsIdCredential,
  AppCredential,
}

export enum Status {
  Loading,
  Error,
  Standby,
}

const PrfsIdCommitment: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const [status, setStatus] = React.useState(Status.Loading);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const searchParams = useSearchParams();
  const [step, setStep] = React.useState(CommitmentStep.PrfsIdCredential);
  const [publicKey, setPublicKey] = React.useState<string | null>(null);
  const [appId, setAppId] = React.useState<string | null>(null);
  const [credential, setCredential] = React.useState<PrfsIdCredential | null>(null);

  React.useEffect(() => {
    const publicKey = searchParams.get("public_key");
    const appId = searchParams.get("app_id");

    if (!publicKey) {
      setStatus(Status.Error);
      setErrorMsg("Invalid URL. 'public_key' is missing. Closing the window");
    } else if (!appId) {
      setStatus(Status.Error);
      setErrorMsg("Invalid URL. 'app_id' is missing. Closing the window");
    } else {
      setPublicKey(publicKey);
      setAppId(appId);
      setStatus(Status.Standby);
    }
  }, [searchParams, setStatus, setErrorMsg, setPublicKey, setAppId, setStep]);

  const handleCloseErrorDialog = React.useCallback(() => {
    window.close();
  }, []);

  const handleClickPrev = React.useCallback(() => {
    setStep(CommitmentStep.PrfsIdCredential);
  }, [setStep]);

  const handleSucceedSignIn = React.useCallback(
    (credential: PrfsIdCredential) => {
      if (credential) {
        setCredential(credential);
        setStep(CommitmentStep.AppCredential);
      }
    },
    [setCredential, setStep],
  );

  const content = React.useMemo(() => {
    if (!appId || !publicKey) {
      return null;
    }

    switch (step) {
      case CommitmentStep.PrfsIdCredential: {
        return <PrfsIdSignIn appId={appId} handleSucceedSignIn={handleSucceedSignIn} />;
      }
      case CommitmentStep.AppCredential: {
        return (
          credential && (
            <Commitments
              credential={credential}
              appId={appId}
              publicKey={publicKey}
              handleClickPrev={handleClickPrev}
            />
          )
        );
      }
      default:
        <div>Invalid step</div>;
    }
  }, [step, publicKey, appId]);

  return (
    <PrfsIdSignInModule>
      <PrfsIdSignInForm>
        {status === Status.Loading && (
          <div className={styles.overlay}>
            <Spinner color="#1b62c0" />
          </div>
        )}
        {status === Status.Error && (
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

export default PrfsIdCommitment;
