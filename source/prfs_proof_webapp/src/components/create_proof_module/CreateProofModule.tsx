import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import cn from "classnames";
import { IoMdAdd } from "@react-icons/all-files/io/IoMdAdd";
import { ProofGenArgs, makeProofGenSearchParams } from "@taigalabs/prfs-id-sdk-web/proof_gen";
import {
  API_PATH,
  ProofGenSuccessPayload,
  QueryType,
  createSessionKey,
  openPopup,
} from "@taigalabs/prfs-id-sdk-web";
import { PrivateKey, createRandomKeyPair, decrypt, makeRandInt } from "@taigalabs/prfs-crypto-js";
import { TbNumbers } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbNumbers";
import { usePrfsIdSession } from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/use_prfs_id_session";
import PrfsIdSessionDialog from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/PrfsIdSessionDialog";
import { setGlobalError } from "@taigalabs/prfs-react-lib/src/global_error_reducer";
import { PrfsIdSession } from "@taigalabs/prfs-entities/bindings/PrfsIdSession";

import styles from "./CreateProofModule.module.scss";
import { i18nContext } from "@/i18n/context";
import ProofTypeMeta from "@/components/proof_type_meta/ProofTypeMeta";
import { envs } from "@/envs";
import { useAppDispatch } from "@/state/hooks";

const PROOF = "Proof";

enum Status {
  Loading,
  Standby,
}

const CreateProofModule: React.FC<CreateProofModuleProps> = ({
  proofType,
  handleCreateProofResult,
}) => {
  const i18n = React.useContext(i18nContext);
  const [systemMsg, setSystemMsg] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState(Status.Standby);
  const { openPrfsIdSession, isPrfsDialogOpen, setIsPrfsDialogOpen, sessionKey, setSessionKey } =
    usePrfsIdSession();
  const [sk, setSk] = React.useState<PrivateKey | null>(null);
  const dispatch = useAppDispatch();

  const handleClickCreateProof = React.useCallback(async () => {
    const session_key = createSessionKey();
    const { sk, pkHex } = createRandomKeyPair();
    const proofGenArgs: ProofGenArgs = {
      nonce: makeRandInt(1000000),
      app_id: "prfs_proof",
      queries: [
        {
          name: PROOF,
          proofTypeId: proofType.proof_type_id,
          queryType: QueryType.CREATE_PROOF,
          proofAction: "PROOF_ACTION",
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
  ]);

  const handleSucceedGetSession = React.useCallback(
    (session: PrfsIdSession) => {
      if (!sk) {
        dispatch(
          setGlobalError({
            message: "Secret key is not set to decrypt Prfs ID session",
          }),
        );
        return;
      }

      console.log(11, session);

      const buf = Buffer.from(session.value);
      let decrypted: string;
      try {
        decrypted = decrypt(sk.secret, buf).toString();
      } catch (err) {
        dispatch(
          setGlobalError({
            message: `Cannot decrypt payload, err: ${err}`,
          }),
        );
        return;
      }

      console.log(33, decrypted);

      let payload: ProofGenSuccessPayload;
      try {
        payload = JSON.parse(decrypted) as ProofGenSuccessPayload;
      } catch (err) {
        dispatch(
          setGlobalError({
            message: `Cannot parse proof payload, err: ${err}`,
          }),
        );
        return;
      }
      console.log(22, payload);

      const proof = payload.receipt[PROOF] as ProveReceipt;
      if (proof) {
        handleCreateProofResult(proof);
      } else {
        dispatch(
          setGlobalError({
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
  proofType: PrfsProofType;
  handleCreateProofResult: (proveReceipt: ProveReceipt) => void;
}

export interface LoadDriverProgressProps {
  progress: Record<string, any>;
}
