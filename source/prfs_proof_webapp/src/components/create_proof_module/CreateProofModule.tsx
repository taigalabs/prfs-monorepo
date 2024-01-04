import React from "react";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import { ProveReceipt } from "@taigalabs/prfs-driver-interface";
import cn from "classnames";
import { useSearchParams } from "next/navigation";
import { IoMdAdd } from "@react-icons/all-files/io/IoMdAdd";
import { ProofGenArgs, makeProofGenSearchParams } from "@taigalabs/prfs-id-sdk-web/proof_gen";
import { usePopup, usePrfsEmbed } from "@taigalabs/prfs-id-sdk-react";
import {
  API_PATH,
  ProofGenSuccessPayload,
  QueryType,
  newPrfsIdMsg,
  parseBuffer,
  sendMsgToChild,
} from "@taigalabs/prfs-id-sdk-web";
import { decrypt } from "@taigalabs/prfs-crypto-js";
import { TbNumbers } from "@taigalabs/prfs-react-lib/src/tabler_icons/TbNumbers";

import styles from "./CreateProofModule.module.scss";
import { i18nContext } from "@/i18n/context";
import TutorialStepper from "@/components/tutorial/TutorialStepper";
import ProofTypeMeta from "@/components/proof_type_meta/ProofTypeMeta";
import { envs } from "@/envs";
import { useRandomKeyPair } from "@/hooks/key";

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
  const [status, setStatus] = React.useState(Status.Loading);
  const searchParams = useSearchParams();
  const { sk, pkHex } = useRandomKeyPair();
  const { openPopup } = usePopup();
  const isTutorial = React.useMemo(() => {
    if (searchParams.get("tutorial_id")) {
      return true;
    }
    return false;
  }, [searchParams]);
  const { prfsEmbed, isReady: isPrfsReady } = usePrfsEmbed();

  const handleClickCreateProof = React.useCallback(async () => {
    const proofGenArgs: ProofGenArgs = {
      nonce: Math.random() * 1000000,
      appId: "prfs_proof",
      queries: [
        {
          name: PROOF,
          proofTypeId: proofType.proof_type_id,
          queryType: QueryType.CREATE_PROOF,
        },
      ],
      publicKey: pkHex,
    };
    const searchParams = makeProofGenSearchParams(proofGenArgs);
    const endpoint = `${envs.NEXT_PUBLIC_PRFS_ID_WEBAPP_ENDPOINT}${API_PATH.proof_gen}${searchParams}`;

    openPopup(endpoint, async () => {
      if (!prfsEmbed || !isPrfsReady) {
        return;
      }

      const resp = await sendMsgToChild(
        newPrfsIdMsg("REQUEST_PROOF_GEN", { appId: proofGenArgs.appId }),
        prfsEmbed,
      );

      if (resp) {
        try {
          const buf = parseBuffer(resp);
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
        } catch (err) {
          console.error(err);
        }
      } else {
        console.error("Returned val is empty");
      }
    });
  }, [proofType, handleCreateProofResult, setSystemMsg, status]);

  React.useEffect(() => {
    async function fn() {
      if (isPrfsReady) {
        setStatus(Status.Standby);
      }
    }
    fn().then();
  }, [proofType, setStatus, isPrfsReady, setSystemMsg]);

  return (
    <div className={cn(styles.wrapper, { [styles.isTutorial]: isTutorial })}>
      <div className={styles.systemMsg}></div>
      <div className={cn(styles.main, { [styles.isTutorial]: isTutorial })}>
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
              <TutorialStepper steps={[2]}>
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
