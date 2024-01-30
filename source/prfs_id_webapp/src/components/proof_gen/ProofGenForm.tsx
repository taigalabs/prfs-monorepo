import React from "react";
import cn from "classnames";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { useSearchParams } from "next/navigation";
import {
  PrfsIdCredential,
  sendMsgToChild,
  newPrfsIdMsg,
  newPrfsIdErrorMsg,
  ProofGenArgs,
  QueryType,
  ProofGenSuccessPayload,
} from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { encrypt } from "@taigalabs/prfs-crypto-js";
import { PrfsIdentitySignInRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdentitySignInRequest";
import { idApi } from "@taigalabs/prfs-api-js";
import { useMutation } from "@tanstack/react-query";
import { delay } from "@taigalabs/prfs-react-lib/src/hooks/interval";

import styles from "./ProofGenForm.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  DefaultErrorMsg,
  DefaultInnerPadding,
  DefaultModuleBtnRow,
  DefaultModuleHeader,
  DefaultModuleTitle,
} from "@/components/default_module/DefaultModule";
import CommitmentView from "@/components/commitment/CommitmentView";
import CreateProof from "@/components/create_proof/CreateProof";
import { QueryItemList } from "@/components/default_module/QueryItem";
import { ProofGenReceiptRaw, processReceipt } from "./receipt";
import PrfsIdErrorDialog from "../error_dialog/PrfsIdErrorDialog";

enum Status {
  InProgress,
  Standby,
}

const ProofGenForm: React.FC<ProofGenFormProps> = ({
  handleClickPrev,
  proofGenArgs,
  credential,
  prfsEmbed,
}) => {
  const i18n = React.useContext(i18nContext);
  const searchParams = useSearchParams();
  const [status, setStatus] = React.useState(Status.InProgress);
  const [createProofStatus, setCreateProofStatus] = React.useState(Status.Standby);
  const [errorMsg, setErrorMsg] = React.useState<React.ReactNode | null>(null);
  const [errorDialogMsg, setErrorDialogMsg] = React.useState<React.ReactNode | null>(null);
  const { mutateAsync: prfsIdentitySignInRequest } = useMutation({
    mutationFn: (req: PrfsIdentitySignInRequest) => {
      return idApi("sign_in_prfs_identity", req);
    },
  });
  const [receipt, setReceipt] = React.useState<ProofGenReceiptRaw | null>(null);
  const [queryElems, setQueryElems] = React.useState<React.ReactNode>(
    <div className={styles.sidePadding}>Loading...</div>,
  );

  React.useEffect(() => {
    async function fn() {
      try {
        if (proofGenArgs) {
          let elems = [];
          const receipt: Record<string, string> = {};
          for (const query of proofGenArgs.queries) {
            switch (query.queryType) {
              case QueryType.CREATE_PROOF: {
                const elem = (
                  <CreateProof
                    key={query.name}
                    credential={credential}
                    setErrorDialogMsg={setErrorDialogMsg}
                    query={query}
                    setReceipt={setReceipt}
                    tutorial={proofGenArgs.tutorial}
                  />
                );
                elems.push(elem);
                break;
              }
              case QueryType.COMMITMENT: {
                const elem = (
                  <CommitmentView
                    key={query.name}
                    credential={credential}
                    query={query}
                    setReceipt={setReceipt}
                  />
                );
                elems.push(elem);
                break;
              }
              default:
                console.error("unsupported query type", query);
                return;
            }
          }

          setReceipt(receipt);
          setQueryElems(elems);
          setStatus(Status.Standby);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fn().then();
  }, [searchParams, setReceipt, setQueryElems, proofGenArgs, setStatus]);

  const handleClickSubmit = React.useCallback(async () => {
    if (proofGenArgs && credential && prfsEmbed && status === Status.Standby) {
      const { payload: _signInRequestPayload, error } = await prfsIdentitySignInRequest({
        identity_id: credential.id,
      });
      if (error) {
        setErrorMsg(error);
        return;
      }
      if (!receipt) {
        setErrorMsg("no proof gen receipt");
        return;
      }

      setCreateProofStatus(Status.InProgress);
      await delay(500);
      const processedReceipt = await processReceipt(receipt);
      const payload: ProofGenSuccessPayload = {
        receipt: processedReceipt,
      };
      const encrypted = JSON.stringify(
        encrypt(proofGenArgs.public_key, Buffer.from(JSON.stringify(payload))),
      );
      console.log("receipt: %o, encrypted", processedReceipt, encrypted);

      try {
        await sendMsgToChild(
          newPrfsIdMsg("PROOF_GEN_RESULT", {
            appId: proofGenArgs.app_id,
            value: encrypted,
          }),
          prfsEmbed,
        );
      } catch (err: any) {
        await sendMsgToChild(newPrfsIdErrorMsg("PROOF_GEN_RESULT", err.toString()), prfsEmbed);
        console.error(err);
      }

      setCreateProofStatus(Status.Standby);
      window.close();
    }
  }, [searchParams, proofGenArgs, credential, setErrorMsg, receipt, setCreateProofStatus]);

  const handleCloseErrorDialog = React.useCallback(() => {}, []);

  return proofGenArgs ? (
    <>
      {errorDialogMsg && (
        <PrfsIdErrorDialog errorMsg={errorDialogMsg} handleClose={handleCloseErrorDialog} />
      )}
      <DefaultInnerPadding noSidePadding>
        {(status === Status.InProgress || createProofStatus === Status.InProgress) && (
          <div className={styles.overlay} />
        )}
        <DefaultModuleHeader noTopPadding className={styles.sidePadding}>
          <DefaultModuleTitle>
            <span className={styles.blueText}>{proofGenArgs.app_id}</span> wants you to submit
            information
          </DefaultModuleTitle>
        </DefaultModuleHeader>
        <div className={cn(styles.prfsId, styles.sidePadding)}>
          <p>{credential.id}</p>
        </div>
        <QueryItemList sidePadding>{queryElems}</QueryItemList>
        <div className={cn(styles.dataWarning, styles.sidePadding)}>
          <p className={styles.title}>Make sure you trust {proofGenArgs.app_id} app</p>
          <p className={styles.desc}>{i18n.app_data_sharing_guide}</p>
        </div>
        <DefaultModuleBtnRow className={cn(styles.btnRow, styles.sidePadding)}>
          <Button variant="transparent_blue_2" noTransition handleClick={handleClickPrev}>
            {i18n.go_back}
          </Button>
          <Button
            type="button"
            variant="blue_2"
            className={styles.submitBtn}
            contentClassName={styles.submitBtnContent}
            noTransition
            handleClick={handleClickSubmit}
            noShadow
          >
            <span>{i18n.submit}</span>
            {createProofStatus === Status.InProgress && <Spinner size={16} />}
          </Button>
        </DefaultModuleBtnRow>
        {errorMsg && <DefaultErrorMsg className={styles.sidePadding}>{errorMsg}</DefaultErrorMsg>}
      </DefaultInnerPadding>
    </>
  ) : (
    <div className={styles.loading}>Loading...</div>
  );
};

export default ProofGenForm;

export interface ProofGenFormProps {
  handleClickPrev: () => void;
  credential: PrfsIdCredential;
  proofGenArgs: ProofGenArgs | null;
  prfsEmbed: HTMLIFrameElement | null;
}
