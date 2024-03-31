import React from "react";
import cn from "classnames";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import { useSearchParams } from "next/navigation";
import {
  PrfsIdCredential,
  ProofGenArgs,
  QueryType,
  ProofGenSuccessPayload,
} from "@taigalabs/prfs-id-sdk-web";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { JSONbigNative, encrypt } from "@taigalabs/prfs-crypto-js";
import { delay } from "@taigalabs/prfs-react-lib/src/hooks/interval";
import PrfsIdSessionErrorCodes from "@taigalabs/prfs-id-session-api-error-codes";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import { setGlobalError } from "@taigalabs/prfs-react-lib/src/global_error_reducer";

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
import EncryptView from "@/components/encrypt/EncryptView";
import { usePutSessionValue } from "@/hooks/session";
import AppCredential from "@/components/app_sign_in/AppCredential";
import RandKeyPairView from "@/components/rand_key_pair/RandKeyPairView";
import { useAppDispatch } from "@/state/hooks";
import { setGlobalMsg } from "@/state/globalMsgReducer";

enum Status {
  InProgress,
  Standby,
}

const DEBUG__keepWindowAtTheEnd = true;

const ProofGenForm: React.FC<ProofGenFormProps> = ({
  handleClickPrev,
  proofGenArgs,
  credential,
}) => {
  const i18n = React.useContext(i18nContext);
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [status, setStatus] = React.useState(Status.InProgress);
  const [createProofStatus, setCreateProofStatus] = React.useState(Status.Standby);
  const [errorMsg, setErrorMsg] = React.useState<React.ReactNode | null>(null);
  const { mutateAsync: putSessionValueRequest } = usePutSessionValue();
  const [receipt, setReceipt] = React.useState<ProofGenReceiptRaw | null>({});
  const [queryElems, setQueryElems] = React.useState<React.ReactNode>(
    <div className={styles.sidePadding}>Loading...</div>,
  );

  const handleSkip = React.useCallback(
    async (arg: Record<string, any>) => {
      if (proofGenArgs && receipt && arg) {
        setCreateProofStatus(Status.InProgress);
        const payload: ProofGenSuccessPayload = {
          receipt: {
            ...receipt,
            ...arg,
          },
        };

        const encrypted = [
          ...encrypt(proofGenArgs.public_key, Buffer.from(JSONbigNative.stringify(payload))),
        ];
        const { error, code } = await putSessionValueRequest({
          key: proofGenArgs.session_key,
          value: encrypted,
          ticket: "TICKET",
        });

        if (error && code === PrfsIdSessionErrorCodes.SESSION_NOT_EXISTS.code) {
          setErrorMsg(error.toString());
          setCreateProofStatus(Status.Standby);
          dispatch(
            setGlobalError({
              message: "Session may be old. Re-try after closing the window",
              shouldCloseWindow: true,
            }),
          );
          return;
        }

        dispatch(setGlobalMsg({ message: i18n.already_made_proof, notDismissible: true }));
        setCreateProofStatus(Status.Standby);

        if (!DEBUG__keepWindowAtTheEnd) {
          setTimeout(() => {
            window.close();
          }, 2000);
        }
      }
    },
    [proofGenArgs, putSessionValueRequest, setErrorMsg, setCreateProofStatus, receipt, dispatch],
  );

  React.useEffect(() => {
    async function fn() {
      try {
        if (proofGenArgs) {
          let elems = [];
          for (const query of proofGenArgs.queries) {
            switch (query.queryType) {
              case QueryType.CREATE_PROOF: {
                const elem = (
                  <CreateProof
                    key={query.name}
                    credential={credential}
                    query={query}
                    setReceipt={setReceipt}
                    handleSkip={handleSkip}
                  />
                );
                elems.push(elem);
                continue;
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
                continue;
              }
              case QueryType.ENCRYPT: {
                const elem = (
                  <EncryptView
                    key={query.name}
                    credential={credential}
                    query={query}
                    setReceipt={setReceipt}
                  />
                );
                elems.push(elem);
                continue;
              }
              case QueryType.APP_SIGN_IN: {
                const elem = (
                  <AppCredential
                    key={query.name}
                    credential={credential}
                    appId={proofGenArgs.app_id}
                    appSignInQuery={query}
                    setReceipt={setReceipt}
                  />
                );
                elems.push(elem);
                continue;
              }
              case QueryType.RAND_KEY_PAIR: {
                const elem = (
                  <RandKeyPairView
                    key={query.name}
                    credential={credential}
                    query={query}
                    setReceipt={setReceipt}
                  />
                );
                elems.push(elem);
                continue;
              }
              default:
                console.error("unsupported query type", query);
                dispatch(
                  setGlobalError({
                    message: "Unsupported query type, something is wrong",
                  }),
                );
                return;
            }
          }

          setQueryElems(elems);
          setStatus(Status.Standby);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fn().then();
  }, [searchParams, setReceipt, setQueryElems, proofGenArgs, setStatus, handleSkip]);

  const handleClickSubmit = React.useCallback(async () => {
    if (proofGenArgs && credential && status === Status.Standby) {
      if (!receipt) {
        setErrorMsg("no proof gen receipt");
        return;
      }

      try {
        setCreateProofStatus(Status.InProgress);
        await delay(500);
        const processedReceipt = await processReceipt(receipt);
        const payload: ProofGenSuccessPayload = {
          receipt: processedReceipt,
        };

        const encrypted = [
          ...encrypt(proofGenArgs.public_key, Buffer.from(JSONbigNative.stringify(payload))),
        ];
        // console.log("receipt: %o, encrypted", processedReceipt, encrypted);

        const { error } = await putSessionValueRequest({
          key: proofGenArgs.session_key,
          value: encrypted,
          ticket: "TICKET",
        });

        if (error) {
          setErrorMsg(error.toString());
          setCreateProofStatus(Status.Standby);
          return;
        }

        setCreateProofStatus(Status.Standby);

        // For some reason, parent window sees the child as 'child', so child manually
        // closes itself
        if (!DEBUG__keepWindowAtTheEnd) {
          window.close();
        }
      } catch (err: any) {
        dispatch(
          setGlobalError({
            message: `Failed to generate proof, ${err.toString()}`,
            // errorObj: err,
          }),
        );
        setCreateProofStatus(Status.Standby);
      }
    }
  }, [
    dispatch,
    searchParams,
    proofGenArgs,
    credential,
    setErrorMsg,
    receipt,
    setCreateProofStatus,
    putSessionValueRequest,
  ]);

  const abbrevId = React.useMemo(() => {
    return abbrev7and5(credential.id);
  }, [credential.id]);

  return proofGenArgs ? (
    <>
      <DefaultInnerPadding noSidePadding>
        {(status === Status.InProgress || createProofStatus === Status.InProgress) && (
          <div className={styles.overlay} />
        )}
        <DefaultModuleHeader noTopPadding>
          <DefaultModuleTitle>
            <span className={styles.blueText}>{proofGenArgs.app_id}</span> wants you to submit
            information
          </DefaultModuleTitle>
        </DefaultModuleHeader>
        <div className={cn(styles.prfsId, styles.sidePadding)}>
          <p>{abbrevId}</p>
        </div>
        <QueryItemList sidePadding>{queryElems}</QueryItemList>
        <div className={cn(styles.dataWarning, styles.sidePadding)}>
          <p className={styles.title}>Make sure you trust {proofGenArgs.app_id} app</p>
          <p className={styles.desc}>{i18n.app_data_sharing_guide}</p>
        </div>
        <DefaultModuleBtnRow className={cn(styles.btnRow, styles.sidePadding)}>
          <Button variant="transparent_blue_3" noTransition handleClick={handleClickPrev} rounded>
            {i18n.go_back}
          </Button>
          <Button
            type="button"
            rounded
            variant="blue_3"
            className={styles.submitBtn}
            contentClassName={styles.submitBtnContent}
            noTransition
            handleClick={handleClickSubmit}
            noShadow
          >
            <span>{i18n.submit}</span>
            {createProofStatus === Status.InProgress && <Spinner size={14} />}
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
}
