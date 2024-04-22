import React from "react";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import cn from "classnames";
import { IoMdAdd } from "@react-icons/all-files/io/IoMdAdd";
import { utils as walletUtils } from "@taigalabs/prfs-crypto-deps-js/ethers";
import { ProofGenArgs, makeProofGenSearchParams } from "@taigalabs/prfs-id-sdk-web/proof_gen";
import {
  API_PATH,
  ProofGenSuccessPayload,
  QueryType,
  createSessionKey,
  openPopup,
} from "@taigalabs/prfs-id-sdk-web";
import {
  JSONbigNative,
  PrivateKey,
  createRandomKeyPair,
  decrypt,
  makeRandInt,
  rand256,
} from "@taigalabs/prfs-crypto-js";
import { TbNumbers } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbNumbers";
import { usePrfsIdSession } from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/use_prfs_id_session";
import PrfsIdSessionDialog from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/PrfsIdSessionDialog";
import { PrfsIdSession } from "@taigalabs/prfs-entities/bindings/PrfsIdSession";
import { PrfsProofTypeSyn1 } from "@taigalabs/prfs-entities/bindings/PrfsProofTypeSyn1";

import styles from "./CreateProofModule.module.scss";
import { i18nContext } from "@/i18n/context";
import ProofTypeMeta from "@/components/proof_type_meta/ProofTypeMeta";
import { envs } from "@/envs";
import { useAppDispatch } from "@/state/hooks";
import { setGlobalMsg } from "@/state/globalMsgReducer";
import { CreatePrfsProofAction } from "@taigalabs/prfs-entities/bindings/CreatePrfsProofAction";
import { computeAddress } from "@taigalabs/prfs-crypto-deps-js/ethers/lib/utils";

const PROOF = "Proof";

enum Status {
  Loading,
  Standby,
}

const CreateProofModule: React.FC<CreateProofModuleProps> = ({
  proofType,
  handleCreateProofResult,
  setProofAction,
}) => {
  const i18n = React.useContext(i18nContext);
  const [systemMsg, setSystemMsg] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState(Status.Standby);
  const {
    openPrfsIdSession,
    isPrfsDialogOpen,
    setIsPrfsDialogOpen,
    sessionKey,
    setSessionKey,
    sk,
    setSk,
  } = usePrfsIdSession();
  const dispatch = useAppDispatch();

  const handleClickCreateProof = React.useCallback(async () => {
    const session_key = createSessionKey();
    const { sk, pkHex } = createRandomKeyPair();
    const nonce = rand256();
    const proofAction: CreatePrfsProofAction = {
      nonce,
    };
    const proofActionStr = JSON.stringify(proofAction);

    const proofGenArgs: ProofGenArgs = {
      nonce: makeRandInt(1000000),
      app_id: "prfs_proof",
      queries: [
        {
          name: PROOF,
          proofTypeId: proofType.proof_type_id,
          queryType: QueryType.CREATE_PROOF,
          proofAction: proofActionStr,
        },
      ],
      public_key: pkHex,
      session_key,
    };

    const searchParams = makeProofGenSearchParams(proofGenArgs);
    const endpoint = `${envs.NEXT_PUBLIC_PRFS_ID_WEBAPP_ENDPOINT}${API_PATH.proof_gen}${searchParams}`;

    const popup = openPopup(endpoint);
    if (!popup) {
      return;
    }

    const { payload: _ } = await openPrfsIdSession({
      key: proofGenArgs.session_key,
      value: null,
      ticket: "TICKET",
    });

    setProofAction(proofAction);
    setIsPrfsDialogOpen(true);
    setSessionKey(proofGenArgs.session_key);
    setSk(sk);
  }, [
    proofType,
    handleCreateProofResult,
    setSystemMsg,
    status,
    openPrfsIdSession,
    setIsPrfsDialogOpen,
    setSessionKey,
    setSk,
    setProofAction,
  ]);

  const handleSucceedGetSession = React.useCallback(
    (session: PrfsIdSession) => {
      if (!sk) {
        dispatch(
          setGlobalMsg({
            variant: "error",
            message: "Secret key is not set to decrypt Prfs ID session",
          }),
        );
        return;
      }

      const buf = Buffer.from(session.value);
      let decrypted: string;
      try {
        decrypted = decrypt(sk.secret, buf).toString();
      } catch (err) {
        dispatch(
          setGlobalMsg({
            variant: "error",
            message: `Cannot decrypt payload, err: ${err}`,
          }),
        );
        return;
      }

      let payload: ProofGenSuccessPayload;
      try {
        payload = JSON.parse(decrypted) as ProofGenSuccessPayload;
      } catch (err) {
        dispatch(
          setGlobalMsg({
            variant: "error",
            message: `Cannot parse proof payload, err: ${err}`,
          }),
        );
        return;
      }

      const proveReceipt = payload.receipt[PROOF] as ProveReceipt;
      // const publicInputs: MerkleSigPosRangeV1PublicInputs = JSONbigNative.parse(
      //   proveReceipt.proof.publicInputSer,
      // );
      // console.log("proveReceipt: %o", proveReceipt);

      // const recoveredAddr = walletUtils.verifyMessage(
      //   proveReceipt.proofActionSigMsg,
      //   proveReceipt.proofActionSig,
      // );
      // const addr = computeAddress(publicInputs.proofPubKey);
      // if (recoveredAddr !== addr) {
      //   dispatch(
      //     setGlobalMsg({
      //       variant: "error",
      //       message: `Signature does not match, recovered: ${recoveredAddr}, addr: ${addr}`,
      //     }),
      //   );
      //   return;
      // }

      const proof = payload.receipt[PROOF] as ProveReceipt;
      if (proof) {
        handleCreateProofResult(proof);
      } else {
        dispatch(
          setGlobalMsg({
            variant: "error",
            message: "no proof delivered",
          }),
        );
        return;
      }
    },
    [sk, dispatch],
  );

  return (
    <>
      <div className={styles.wrapper}>
        {systemMsg && <div className={styles.systemMsg}>{systemMsg}</div>}
        <div className={styles.main}>
          <div className={styles.controlArea}>
            <div className={styles.btnSection}>
              <div className={styles.desc}>
                <p className={styles.numberIcon}>
                  <TbNumbers />
                </p>
                <p className={styles.label}>{i18n.create_proof_desc}</p>
              </div>
              <div className={styles.btnRow}>
                {status === Status.Loading && <div className={styles.overlay} />}
                <button onClick={handleClickCreateProof} className={cn(styles.createBtn)}>
                  <IoMdAdd />
                  <span>{i18n.create_proof_with_prfs}</span>
                </button>
              </div>
            </div>
          </div>
          <div className={styles.metaArea}>
            <ProofTypeMeta proofType={proofType} />
          </div>
        </div>
      </div>
      <PrfsIdSessionDialog
        sessionKey={sessionKey}
        isPrfsDialogOpen={isPrfsDialogOpen}
        setIsPrfsDialogOpen={setIsPrfsDialogOpen}
        actionLabel={i18n.create_proof.toLowerCase()}
        handleSucceedGetSession={handleSucceedGetSession}
      />
    </>
  );
};

export default CreateProofModule;

export interface CreateProofModuleProps {
  proofType: PrfsProofTypeSyn1;
  handleCreateProofResult: (proveReceipt: ProveReceipt) => void;
  setProofAction: React.Dispatch<React.SetStateAction<CreatePrfsProofAction | null>>;
}

export interface LoadDriverProgressProps {
  progress: Record<string, any>;
}
