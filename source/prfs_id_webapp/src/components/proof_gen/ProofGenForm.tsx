import React from "react";
import { poseidon_2, prfsSign } from "@taigalabs/prfs-crypto-js";
import cn from "classnames";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
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
import Spinner from "@taigalabs/prfs-react-components/src/spinner/Spinner";
import { encrypt } from "@taigalabs/prfs-crypto-js";
import { PrfsIdentitySignInRequest } from "@taigalabs/prfs-entities/bindings/PrfsIdentitySignInRequest";
import { idApi } from "@taigalabs/prfs-api-js";
import { hexlify } from "ethers/lib/utils";
import { useMutation } from "@tanstack/react-query";
import LoaderBar from "@taigalabs/prfs-react-components/src/loader_bar/LoaderBar";

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
import { QueryItem, QueryItemList } from "@/components/default_module/QueryItem";
import { ProofGenReceiptRaw, processReceipt } from "./receipt";
import { delay } from "@/hooks/interval";

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
  const [errorMsg, setErrorMsg] = React.useState("");
  const { mutateAsync: prfsIdentitySignInRequest } = useMutation({
    mutationFn: (req: PrfsIdentitySignInRequest) => {
      return idApi("sign_in_prfs_identity", req);
    },
  });
  const [receipt, setReceipt] = React.useState<ProofGenReceiptRaw | null>(null);
  const [queryElems, setQueryElems] = React.useState<React.ReactNode>(null);

  React.useEffect(() => {
    async function fn() {
      try {
        if (proofGenArgs) {
          let elems = [];
          const receipt: Record<string, string> = {};
          for (const query of proofGenArgs.queries) {
            switch (query.queryType) {
              case QueryType.CREATE_PROOF_TYPE: {
                const elem = (
                  <CreateProof
                    key={query.name}
                    credential={credential}
                    query={query}
                    setReceipt={setReceipt}
                  />
                );
                elems.push(elem);
                break;
              }
              case QueryType.COMMITMENT_TYPE: {
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

      setStatus(Status.InProgress);
      await delay(500);
      const processedReceipt = await processReceipt(receipt);
      const payload: ProofGenSuccessPayload = {
        receipt: processedReceipt,
      };
      const encrypted = JSON.stringify(
        encrypt(proofGenArgs.publicKey, Buffer.from(JSON.stringify(payload))),
      );
      console.log("receipt: %o, encrypted", processedReceipt, encrypted);

      try {
        await sendMsgToChild(
          newPrfsIdMsg("PROOF_GEN_RESULT", {
            appId: proofGenArgs.appId,
            key: proofGenArgs.publicKey,
            value: encrypted,
          }),
          prfsEmbed,
        );
      } catch (err: any) {
        await sendMsgToChild(newPrfsIdErrorMsg("PROOF_GEN_RESULT", err.toString()), prfsEmbed);
        console.error(err);
      }

      setStatus(Status.Standby);
      // window.close();
    }
  }, [searchParams, proofGenArgs, credential, setErrorMsg, receipt, setStatus]);

  return proofGenArgs ? (
    <>
      <DefaultInnerPadding noSidePadding>
        <DefaultModuleHeader noTopPadding className={styles.sidePadding}>
          <DefaultModuleTitle>
            <span className={styles.blueText}>{proofGenArgs.appId}</span> wants you to submit
            information
          </DefaultModuleTitle>
        </DefaultModuleHeader>
        <div className={cn(styles.prfsId, styles.sidePadding)}>
          <p>{credential.id}</p>
        </div>
        <QueryItemList sidePadding>{queryElems}</QueryItemList>
        <div className={cn(styles.dataWarning, styles.sidePadding)}>
          <p className={styles.title}>Make sure you trust {proofGenArgs.appId} app</p>
          <p className={styles.desc}>{i18n.app_data_sharing_guide}</p>
        </div>
        <DefaultModuleBtnRow className={cn(styles.btnRow, styles.sidePadding)}>
          <Button variant="transparent_blue_2" noTransition handleClick={handleClickPrev}>
            {i18n.go_back}
          </Button>
          <Button
            type="button"
            variant="blue_2"
            className={styles.signInBtn}
            contentClassName={styles.signInBtnContent}
            noTransition
            handleClick={handleClickSubmit}
            noShadow
          >
            <span>{i18n.submit}</span>
            {status === Status.InProgress && <Spinner />}
            <Spinner size={18} />
          </Button>
        </DefaultModuleBtnRow>
        <DefaultErrorMsg className={styles.sidePadding}>{errorMsg}</DefaultErrorMsg>
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
