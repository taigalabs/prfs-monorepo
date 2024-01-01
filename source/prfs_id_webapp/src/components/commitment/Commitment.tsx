"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { PrfsIdCredential, parseCommitmentSearchParams } from "@taigalabs/prfs-id-sdk-web";

import styles from "./Commitment.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  DefaultModule,
  DefaultForm,
  DefaultModuleFooter,
} from "@/components/default_module/DefaultModule";
import { envs } from "@/envs";
import PrfsIdErrorDialog from "@/components/error_dialog/PrfsIdErrorDialog";
import SignIn from "@/components/sign_in/SignIn";
import CommitmentView from "./CommitmentView";
import { usePrfsEmbed } from "@taigalabs/prfs-id-sdk-react";
import CommitmentView2 from "./CommitmentView2";

enum CommitmentStep {
  PrfsIdCredential,
  CommitmentView,
}

export enum Status {
  Loading,
  Error,
  Standby,
}

const Commitment: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const [status, setStatus] = React.useState(Status.Loading);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const searchParams = useSearchParams();
  const [step, setStep] = React.useState(CommitmentStep.PrfsIdCredential);
  const [credential, setCredential] = React.useState<PrfsIdCredential | null>(null);
  const commitmentArgs = React.useMemo(() => {
    try {
      const args = parseCommitmentSearchParams(searchParams as URLSearchParams);
      return args;
    } catch (err: any) {
      return null;
    }
  }, [searchParams]);
  const { prfsEmbed, isReady: isPrfsReady } = usePrfsEmbed();

  React.useEffect(() => {
    if (commitmentArgs) {
      const { publicKey, appId } = commitmentArgs;

      if (!publicKey) {
        setStatus(Status.Error);
        setErrorMsg("Invalid URL. 'public_key' is missing. Closing the window");
      } else if (!appId) {
        setStatus(Status.Error);
        setErrorMsg("Invalid URL. 'app_id' is missing. Closing the window");
      } else {
        if (isPrfsReady) {
          setStatus(Status.Standby);
        }
      }
    }
  }, [searchParams, setStatus, setErrorMsg, setStep, commitmentArgs, isPrfsReady]);

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
        setStep(CommitmentStep.CommitmentView);
      }
    },
    [setCredential, setStep],
  );

  const content = React.useMemo(() => {
    if (!commitmentArgs) {
      return null;
    }

    switch (step) {
      case CommitmentStep.PrfsIdCredential: {
        return <SignIn appId={commitmentArgs.appId} handleSucceedSignIn={handleSucceedSignIn} />;
      }
      case CommitmentStep.CommitmentView: {
        return (
          credential && (
            <CommitmentView2
              credential={credential}
              commitmentArgs={commitmentArgs}
              handleClickPrev={handleClickPrev}
              prfsEmbed={prfsEmbed}
            />
          )
        );
      }
      default:
        <div>Invalid step</div>;
    }
  }, [step, commitmentArgs]);

  return (
    <DefaultModule>
      <DefaultForm>
        {status === Status.Loading && (
          <div className={styles.overlay}>
            <Spinner color="#1b62c0" />
          </div>
        )}
        {status === Status.Error && (
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

export default Commitment;
