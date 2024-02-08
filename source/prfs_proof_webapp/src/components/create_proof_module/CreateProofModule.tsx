import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import cn from "classnames";
import { IoMdAdd } from "@react-icons/all-files/io/IoMdAdd";
import { ProofGenArgs, makeProofGenSearchParams } from "@taigalabs/prfs-id-sdk-web/proof_gen";
import { usePopup, usePrfsEmbed } from "@taigalabs/prfs-id-sdk-react";
import {
  API_PATH,
  ProofGenSuccessPayload,
  QueryType,
  createSession,
  newPrfsIdMsg,
  parseBuffer,
  parseBufferOfArray,
  sendMsgToChild,
} from "@taigalabs/prfs-id-sdk-web";
import { decrypt } from "@taigalabs/prfs-crypto-js";
import TutorialStepper from "@taigalabs/prfs-react-lib/src/tutorial/TutorialStepper";
import { TbNumbers } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbNumbers";
import { useTutorial } from "@taigalabs/prfs-react-lib/src/hooks/tutorial";
import { toHex } from "@taigalabs/prfs-crypto-deps-js/viem";

import styles from "./CreateProofModule.module.scss";
import { i18nContext } from "@/i18n/context";
import ProofTypeMeta from "@/components/proof_type_meta/ProofTypeMeta";
import { envs } from "@/envs";
import { useRandomKeyPair } from "@/hooks/key";
import { useAppSelector } from "@/state/hooks";
import { secp256k1 } from "@taigalabs/prfs-crypto-js/secp256k1";

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
  const [status, setStatus] = React.useState(Status.Loading);
  const { sk, pkHex } = useRandomKeyPair();
  const { tutorialId } = useTutorial();
  const { openPopup } = usePopup();
  const { prfsEmbed, isReady: isPrfsReady } = usePrfsEmbed();
  const priv = secp256k1.utils.randomPrivateKey();
  const pk = secp256k1.getPublicKey(priv);
  const session_key = toHex(pk);

  const handleClickCreateProof = React.useCallback(async () => {
    const proofGenArgs: ProofGenArgs = {
      nonce: Math.random() * 1000000,
      app_id: "prfs_proof",
      queries: [
        {
          name: PROOF,
          proofTypeId: proofType.proof_type_id,
          queryType: QueryType.CREATE_PROOF,
        },
      ],
      public_key: pkHex,
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

    openPopup(endpoint, async () => {
      if (!prfsEmbed || !isPrfsReady) {
        return;
      }

      const { ws, send, receive } = await createSession();
      send({
        type: "OPEN_SESSION",
        key: proofGenArgs.session_key,
        ticket: "TICKET",
      });
      const openSessionResp = await receive();
      if (openSessionResp?.error) {
        console.error(openSessionResp?.error);
        return;
      }

      const session = await receive();
      if (session) {
        try {
          if (session.error) {
            console.error(session.error);
          }

          if (session.payload) {
            if (session.payload.type !== "PUT_SESSION_VALUE_RESULT") {
              console.error("Wrong session payload type at this point, msg: %s", session.payload);
              return;
            }
            const buf = parseBufferOfArray(session.payload.value);
            let decrypted: string;
            try {
              decrypted = decrypt(sk.secret, buf).toString();
            } catch (err) {
              console.error("cannot decrypt payload", err);
              return;
            }

            let payload: ProofGenSuccessPayload;
            try {
              payload = JSON.parse(decrypted) as ProofGenSuccessPayload;
            } catch (err) {
              console.error("cannot parse payload", err);
              return;
            }

            const proof = payload.receipt[PROOF] as ProveReceipt;
            if (proof) {
              handleCreateProofResult(proof);
            } else {
              console.error("no proof delivered");
              return;
            }
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        console.error("Returned val is empty");
      }

      ws.close();
    });
  }, [proofType, handleCreateProofResult, setSystemMsg, status]);

  React.useEffect(() => {
    if (isPrfsReady) {
      setStatus(Status.Standby);
    }
  }, [setStatus, isPrfsReady]);

  return (
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
          <ProofTypeMeta
            proofTypeDesc={proofType.desc}
            proofTypeId={proofType.proof_type_id}
            imgUrl={proofType.img_url}
            proofTypeLabel={proofType.label}
            proofTypeAuthor={proofType.author}
            circuitTypeId={proofType.circuit_type_id}
            circuitDriverId={proofType.circuit_driver_id}
            proofTypeCreatedAt={proofType.created_at}
          />
        </div>
      </div>
    </div>
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
