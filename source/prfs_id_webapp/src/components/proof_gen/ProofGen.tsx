"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { PrfsIdCredential, parseProofGenSearchParams } from "@taigalabs/prfs-id-sdk-web";
import { usePrfsEmbed } from "@taigalabs/prfs-id-sdk-react";

import styles from "./ProofGen.module.scss";
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
import ProofGenForm from "./ProofGenForm";

enum ProofGenStep {
  PrfsIdCredential,
  Form,
}

export enum Status {
  Loading,
  Standby,
}

const ProofGen: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const [status, setStatus] = React.useState(Status.Loading);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const searchParams = useSearchParams();
  const [step, setStep] = React.useState(ProofGenStep.PrfsIdCredential);
  const [credential, setCredential] = React.useState<PrfsIdCredential | null>(null);
  const proofGenArgs = React.useMemo(() => {
    try {
      const args = parseProofGenSearchParams(searchParams as URLSearchParams);
      return args;
    } catch (err: any) {
      return null;
    }
  }, [searchParams]);
  const { prfsEmbed, isReady: isPrfsReady } = usePrfsEmbed();

  React.useEffect(() => {
    if (proofGenArgs) {
      const { publicKey, appId } = proofGenArgs;

      if (!publicKey) {
        setErrorMsg("Invalid URL. 'public_key' is missing. Closing the window");
      } else if (!appId) {
        setErrorMsg("Invalid URL. 'app_id' is missing. Closing the window");
      } else {
        if (isPrfsReady) {
          setStatus(Status.Standby);
        }
      }
    }
  }, [searchParams, setStatus, setErrorMsg, setStep, proofGenArgs, isPrfsReady]);

  const handleCloseErrorDialog = React.useCallback(() => {
    window.close();
  }, []);

  const handleClickPrev = React.useCallback(() => {
    setStep(ProofGenStep.PrfsIdCredential);
  }, [setStep]);

  const handleSucceedSignIn = React.useCallback(
    (credential: PrfsIdCredential) => {
      if (credential) {
        setCredential(credential);
        setStep(ProofGenStep.Form);
      }
    },
    [setCredential, setStep],
  );

  const content = React.useMemo(() => {
    if (!proofGenArgs) {
      return null;
    }

    switch (step) {
      case ProofGenStep.PrfsIdCredential: {
        return <SignIn appId={proofGenArgs.appId} handleSucceedSignIn={handleSucceedSignIn} />;
      }
      case ProofGenStep.Form: {
        return credential ? (
          <ProofGenForm
            credential={credential}
            proofGenArgs={proofGenArgs}
            handleClickPrev={handleClickPrev}
            prfsEmbed={prfsEmbed}
          />
        ) : (
          <div>Invalid access. Credential does not exist</div>
        );
      }
      default:
        <div>Invalid step</div>;
    }
  }, [step, proofGenArgs]);

  return (
    <DefaultModule>
      <DefaultForm>
        {errorMsg && <PrfsIdErrorDialog errorMsg={errorMsg} handleClose={handleCloseErrorDialog} />}
        <DefaultTopLabel>{i18n.create_data_with_prfs_id}</DefaultTopLabel>
        {status === Status.Loading ? (
          <div className={styles.overlay}>
            <Spinner color="#1b62c0" />
          </div>
        ) : (
          content
        )}
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

export default ProofGen;
