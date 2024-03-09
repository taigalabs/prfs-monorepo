"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import Overlay from "@taigalabs/prfs-react-lib/src/overlay/Overlay";
import { bustEphemeralPrfsIdCredential } from "@/storage/ephe_credential";
import { PrfsIdCredential, parseProofGenSearchParams } from "@taigalabs/prfs-id-sdk-web";

import styles from "./ProofGen.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  DefaultModule,
  DefaultForm,
  DefaultModuleFooter,
  DefaultTopLabel,
} from "@/components/default_module/DefaultModule";
import SignIn from "@/components/sign_in/SignIn";
import ProofGenForm from "./ProofGenForm";
import { useAppDispatch } from "@/state/hooks";
import { goToStep } from "@/state/tutorialReducer";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import TutorialDefault from "@/components/tutorial_default/TutorialDefault";
import TutorialPlaceholder from "@/components/tutorial_default/TutorialPlaceholder";
import { signInPrfs } from "@/state/userReducer";

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
  const dispatch = useAppDispatch();
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

  React.useEffect(() => {
    if (proofGenArgs) {
      const { public_key, app_id, tutorial } = proofGenArgs;

      if (!public_key) {
        setErrorMsg("Invalid URL. 'public_key' is missing. Closing the window");
      } else if (!app_id) {
        setErrorMsg("Invalid URL. 'app_id' is missing. Closing the window");
      } else {
        setStatus(Status.Standby);
      }

      if (tutorial) {
        dispatch(goToStep(tutorial.step));
      }
    }
  }, [searchParams, setStatus, setErrorMsg, setStep, proofGenArgs, dispatch]);

  const handleCloseErrorDialog = React.useCallback(() => {
    window.close();
  }, []);

  const handleClickPrev = React.useCallback(() => {
    bustEphemeralPrfsIdCredential(true);
    setStep(ProofGenStep.PrfsIdCredential);
  }, [setStep]);

  const handleSucceedSignIn = React.useCallback(
    (credential: PrfsIdCredential) => {
      if (credential) {
        setCredential(credential);
        dispatch(signInPrfs(credential));
        setStep(ProofGenStep.Form);
      }
    },
    [setCredential, setStep, dispatch],
  );

  const content = React.useMemo(() => {
    if (!proofGenArgs) {
      return null;
    }

    switch (step) {
      case ProofGenStep.PrfsIdCredential: {
        return <SignIn appId={proofGenArgs.app_id} handleSucceedSignIn={handleSucceedSignIn} />;
      }
      case ProofGenStep.Form: {
        return credential ? (
          <ProofGenForm
            credential={credential}
            proofGenArgs={proofGenArgs}
            handleClickPrev={handleClickPrev}
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
        <DefaultTopLabel>{i18n.create_data_with_prfs_id}</DefaultTopLabel>
        {status === Status.Loading ? (
          <Overlay fixed>
            <Spinner color="#1b62c0" />
          </Overlay>
        ) : (
          content
        )}
        <TutorialDefault tutorial={proofGenArgs?.tutorial} />
      </DefaultForm>
      <DefaultModuleFooter>
        <GlobalFooter />
      </DefaultModuleFooter>
      <TutorialPlaceholder tutorial={proofGenArgs?.tutorial} />
    </DefaultModule>
  );
};

export default ProofGen;
