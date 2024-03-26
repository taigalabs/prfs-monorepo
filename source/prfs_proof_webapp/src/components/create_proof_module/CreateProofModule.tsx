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
  createSession2,
  createSession,
  createSessionKey,
  openPopup,
} from "@taigalabs/prfs-id-sdk-web";
import { PrivateKey, createRandomKeyPair, decrypt, makeRandInt } from "@taigalabs/prfs-crypto-js";
import TutorialStepper from "@taigalabs/prfs-react-lib/src/tutorial/TutorialStepper";
import { TbNumbers } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbNumbers";
import { useTutorial } from "@taigalabs/prfs-react-lib/src/hooks/tutorial";
import { usePrfsIdSession } from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/use_prfs_id_session";
import PrfsIdSessionDialog from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/PrfsIdSessionDialog";
import { setGlobalError } from "@taigalabs/prfs-react-lib/src/global_error_reducer";

import styles from "./CreateProofModule.module.scss";
import { i18nContext } from "@/i18n/context";
import ProofTypeMeta from "@/components/proof_type_meta/ProofTypeMeta";
import { envs } from "@/envs";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { urls } from "@/urls";

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
  const step = useAppSelector(state => state.tutorial.tutorialStep);
  const [status, setStatus] = React.useState(Status.Standby);
  const { tutorialId } = useTutorial();
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
      success_url: urls.prfs__success,
      session_key,
    };

    if (tutorialId) {
      proofGenArgs.tutorial = {
        tutorialId,
        step,
      };
    }

    const searchParams = makeProofGenSearchParams(proofGenArgs);
    const endpoint = `${envs.NEXT_PUBLIC_PRFS_ID_WEBAPP_ENDPOINT}${API_PATH.proof_gen}${searchParams}`;

    const popup = openPopup(endpoint);
    if (!popup) {
      console.error("Popup couldn't be open");
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

    // let sessionStream;
    // try {
    //   sessionStream = await createSession({
    //     key: proofGenArgs.session_key,
    //     value: null,
    //     ticket: "TICKET",
    //   });
    // } catch (err) {
    //   console.error(err);
    //   return;
    // }

    // if (!sessionStream) {
    //   console.error("Couldn't open a session");
    //   return;
    // }

    // const { ws, send, receive } = sessionStream;
    // const session = await receive();
    // if (!session) {
    //   console.error("Coultn' retreieve session");
    //   return;
    // }

    // try {
    //   if (session.error) {
    //     console.error(session.error);
    //     return;
    //   }

    //   if (!session.payload) {
    //     console.error("Session doesn't have a payload");
    //     return;
    //   }

    //   if (session.payload.type !== "put_prfs_id_session_value_result") {
    //     console.error("Wrong session payload type at this point, msg: %s", session.payload);
    //     return;
    //   }

    //   const buf = Buffer.from(session.payload.value);
    //   let decrypted: string;
    //   try {
    //     decrypted = decrypt(sk.secret, buf).toString();
    //   } catch (err) {
    //     console.error("cannot decrypt payload", err);
    //     return;
    //   }

    //   let payload: ProofGenSuccessPayload;
    //   try {
    //     payload = JSON.parse(decrypted) as ProofGenSuccessPayload;
    //   } catch (err) {
    //     console.error("cannot parse payload", err);
    //     return;
    //   }

    //   const proof = payload.receipt[PROOF] as ProveReceipt;
    //   if (proof) {
    //     handleCreateProofResult(proof);
    //   } else {
    //     console.error("no proof delivered");
    //     return;
    //   }
    // } catch (err) {
    //   console.error(err);
    // }

    // ws.close();
    // popup.close();
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
    (sessionValue: number[]) => {
      if (!sk) {
        dispatch(
          setGlobalError({
            message: "Secret key is not set to decrypt Prfs ID session",
          }),
        );
        return;
      }

      const buf = Buffer.from(sessionValue);
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

      let payload: ProofGenSuccessPayload;
      try {
        payload = JSON.parse(decrypted) as ProofGenSuccessPayload;
      } catch (err) {
        dispatch(
          setGlobalError({
            message: "Cannot parse proof payload",
          }),
        );
        return;
      }

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
                <TutorialStepper tutorialId={tutorialId} step={step} steps={[2]}>
                  <button onClick={handleClickCreateProof} className={cn(styles.createBtn)}>
                    <IoMdAdd />
                    <span>{i18n.create_proof_with_prfs}</span>
                  </button>
                </TutorialStepper>
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
