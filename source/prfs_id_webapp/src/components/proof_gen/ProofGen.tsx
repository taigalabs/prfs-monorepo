"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import Overlay from "@taigalabs/prfs-react-lib/src/overlay/Overlay";
import { bustEphemeralPrfsIdCredential } from "@/storage/ephe_credential";
import { PrfsIdCredential, parseProofGenSearchParams } from "@taigalabs/prfs-id-sdk-web";
import { setGlobalError } from "@taigalabs/prfs-react-lib/src/global_error_reducer";
import PLogo from "@taigalabs/prfs-react-lib/src/prfs_logo/PLogo";
import AppLogo from "@taigalabs/prfs-react-lib/src/app_logo/AppLogo";

import styles from "./ProofGen.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  DefaultModule,
  DefaultForm,
  DefaultModuleFooter,
  DefaultTopLabel,
  DefaultTopLogoRow,
} from "@/components/default_module/DefaultModule";
import SignIn from "@/components/sign_in/SignIn";
import ProofGenForm from "./ProofGenForm";
import { useAppDispatch } from "@/state/hooks";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import { signInPrfs } from "@/state/userReducer";
import { useGetPrfsIdApp, useSignInPrfsIdentity } from "@/requests";

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
  const { mutateAsync: signInPrfsIdentity } = useSignInPrfsIdentity();

  const proofGenArgs = React.useMemo(() => {
    try {
      const args = parseProofGenSearchParams(searchParams as URLSearchParams);
      return args;
    } catch (err: any) {
      return null;
    }
  }, [searchParams]);

  const { data: getPrfsIdAppData } = useGetPrfsIdApp(proofGenArgs?.app_id);

  React.useEffect(() => {
    if (proofGenArgs) {
      const { public_key, app_id } = proofGenArgs;

      if (!public_key) {
        setErrorMsg("Invalid URL. 'public_key' is missing. Closing the window");
      } else if (!app_id) {
        setErrorMsg("Invalid URL. 'app_id' is missing. Closing the window");
      } else {
        setStatus(Status.Standby);
      }
    }
  }, [searchParams, setStatus, setErrorMsg, setStep, proofGenArgs, dispatch]);

  const handleClickPrev = React.useCallback(() => {
    bustEphemeralPrfsIdCredential(true);
    setStep(ProofGenStep.PrfsIdCredential);
  }, [setStep]);

  const handleSucceedSignIn = React.useCallback(
    async (credential: PrfsIdCredential) => {
      if (credential) {
        const { error } = await signInPrfsIdentity({ identity_id: credential.id });
        if (error) {
          dispatch(
            setGlobalError({
              message: `Failed to sign in. Did you sign up? If yes, check out the passwords
\ again. Id you created: ${credential.id}`,
            }),
          );
          return;
        }

        setCredential(credential);
        dispatch(signInPrfs(credential));
        setStep(ProofGenStep.Form);
      }
    },
    [setCredential, setStep, dispatch, signInPrfsIdentity],
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
        <DefaultTopLabel>
          <PLogo width={20} />
          <span>{i18n.create_data_with_prfs_id}</span>
        </DefaultTopLabel>
        {status === Status.Loading ? (
          <Overlay fixed>
            <Spinner color="#1b62c0" />
          </Overlay>
        ) : (
          <>
            <DefaultTopLogoRow>
              {getPrfsIdAppData?.payload && (
                <AppLogo imgUrl={getPrfsIdAppData.payload.prfs_id_app.img_url} />
              )}
            </DefaultTopLogoRow>
            {content}
          </>
        )}
      </DefaultForm>
      <DefaultModuleFooter>
        <GlobalFooter />
      </DefaultModuleFooter>
    </DefaultModule>
  );
};

export default ProofGen;
