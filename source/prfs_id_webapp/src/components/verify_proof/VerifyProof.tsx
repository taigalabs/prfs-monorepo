"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { parseVerifyProofSearchParams } from "@taigalabs/prfs-id-sdk-web";
import { usePrfsEmbed } from "@taigalabs/prfs-id-sdk-react";

import styles from "./VerifyProof.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  DefaultModule,
  DefaultForm,
  DefaultModuleFooter,
  DefaultTopLabel,
} from "@/components/default_module/DefaultModule";
import { envs } from "@/envs";
import PrfsIdErrorDialog from "@/components/error_dialog/PrfsIdErrorDialog";
import { useAppDispatch } from "@/state/hooks";
import { goToStep } from "@/state/tutorialReducer";
import GlobalFooter from "@/components/global_footer/GlobalFooter";
import TutorialDefault from "@/components/tutorial_default/TutorialDefault";
import TutorialPlaceholder from "@/components/tutorial_default/TutorialPlaceholder";
import VerifyProofForm from "./VerifyProofForm";

export enum Status {
  Loading,
  Standby,
}

const VerifyProof: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const [status, setStatus] = React.useState(Status.Loading);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const verifyProofArgs = React.useMemo(() => {
    try {
      const args = parseVerifyProofSearchParams(searchParams as URLSearchParams);
      return args;
    } catch (err: any) {
      return null;
    }
  }, [searchParams]);
  const { prfsEmbed, isReady: isPrfsReady } = usePrfsEmbed();

  React.useEffect(() => {
    if (verifyProofArgs) {
      const { public_key, app_id, tutorial, proof_type_id } = verifyProofArgs;

      if (!public_key) {
        setErrorMsg("Invalid URL. 'public_key' is missing. Closing the window");
      } else if (!app_id) {
        setErrorMsg("Invalid URL. 'app_id' is missing. Closing the window");
      } else if (!proof_type_id) {
        setErrorMsg("Invalid URL. 'proof_type_id' is missing. Closing the window");
      } else {
        if (isPrfsReady) {
          setStatus(Status.Standby);
        }
      }

      if (tutorial) {
        dispatch(goToStep(tutorial.step));
      }
    }
  }, [setStatus, setErrorMsg, verifyProofArgs, isPrfsReady, dispatch]);

  const handleCloseErrorDialog = React.useCallback(() => {
    window.close();
  }, []);

  return (
    <DefaultModule>
      <DefaultForm>
        {errorMsg && <PrfsIdErrorDialog errorMsg={errorMsg} handleClose={handleCloseErrorDialog} />}
        <DefaultTopLabel>{i18n.verify_proof_with_prfs}</DefaultTopLabel>
        {status === Status.Loading ? (
          <div className={styles.overlay}>
            <Spinner color="#1b62c0" />
          </div>
        ) : (
          <VerifyProofForm verifyProofArgs={verifyProofArgs} prfsEmbed={prfsEmbed} />
        )}
        <TutorialDefault tutorial={verifyProofArgs?.tutorial} />
      </DefaultForm>
      <DefaultModuleFooter>
        <GlobalFooter />
      </DefaultModuleFooter>
      <TutorialPlaceholder tutorial={verifyProofArgs?.tutorial} />
    </DefaultModule>
  );
};

export default VerifyProof;