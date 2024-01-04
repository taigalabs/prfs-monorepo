import React from "react";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import cn from "classnames";
import { Proof } from "@taigalabs/prfs-driver-interface";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import { usePopup, usePrfsEmbed } from "@taigalabs/prfs-id-sdk-react";
import {
  API_PATH,
  VerifyProofArgs,
  makeVerifyProofSearchParams,
  newPrfsIdMsg,
  sendMsgToChild,
} from "@taigalabs/prfs-id-sdk-web";
import { useRandomKeyPair } from "@/hooks/key";

import styles from "./VerifyProofModule.module.scss";
import { i18nContext } from "@/i18n/context";
import { useTutorial } from "@taigalabs/prfs-react-lib/src/hooks/tutorial";
import { envs } from "@/envs";
import { useAppSelector } from "@/state/hooks";

export enum VerifiedStatus {
  None,
  InProgress,
  Valid,
  Invalid,
}

const VerifyButton: React.FC<VerifyButtonProps> = ({ verifiedStatus, handleClick }) => {
  const i18n = React.useContext(i18nContext);

  switch (verifiedStatus) {
    case VerifiedStatus.Valid:
      return (
        <Button variant="transparent_black_1" className={styles.validBtn} smallPadding>
          <FaCheck />
          <span>{i18n.verified}</span>
        </Button>
      );

    case VerifiedStatus.Invalid:
      return (
        <Button variant="transparent_black_1" className={styles.invalidBtn} smallPadding>
          <AiOutlineClose />
          <span>{i18n.invalid}</span>
        </Button>
      );

    case VerifiedStatus.InProgress:
      return (
        <Button variant="transparent_black_1" className={styles.progressBtn} smallPadding>
          <Spinner color="#3367d6" size={28} />
        </Button>
      );

    default:
      return (
        <Button
          variant="transparent_blue_1"
          className={styles.verifyBtn}
          handleClick={handleClick}
          smallPadding
        >
          {i18n.verify}
        </Button>
      );
  }
};

const VerifyProofModule: React.FC<VerifyProofModuleProps> = ({ proof, proofTypeId }) => {
  const [verifiedStatus, setVerifiedStatus] = React.useState(VerifiedStatus.None);
  const { openPopup } = usePopup();
  const { prfsEmbed, isReady: isPrfsReady } = usePrfsEmbed();
  const { tutorialId } = useTutorial();
  const { sk, pkHex } = useRandomKeyPair();
  const step = useAppSelector(state => state.tutorial.tutorialStep);

  const handleClickVerify = React.useCallback(async () => {
    if (verifiedStatus === VerifiedStatus.None) {
      try {
        setVerifiedStatus(VerifiedStatus.InProgress);
        // const verifyReceipt = await proofGenElement.verifyProof(proof, circuitTypeId);

        // if (verifyReceipt.verifyResult) {
        //   setVerifiedStatus(VerifiedStatus.Valid);
        // } else {
        //   setVerifiedStatus(VerifiedStatus.Invalid);
        // }

        const verifyProofArgs: VerifyProofArgs = {
          nonce: Math.random() * 1000000,
          app_id: "prfs_proof",
          public_key: pkHex,
          proof_type_id: proofTypeId,
        };

        if (tutorialId) {
          verifyProofArgs.tutorial = {
            tutorialId,
            step,
          };
        }

        const searchParams = makeVerifyProofSearchParams(verifyProofArgs);
        const endpoint = `${envs.NEXT_PUBLIC_PRFS_ID_WEBAPP_ENDPOINT}${API_PATH.verify_proof}${searchParams}`;

        openPopup(endpoint, async () => {
          if (!prfsEmbed || !isPrfsReady) {
            return;
          }

          const resp = await sendMsgToChild(
            newPrfsIdMsg("REQUEST_VERIFY_PROOF", { appId: verifyProofArgs.app_id }),
            prfsEmbed,
          );

          // if (resp) {
          //   try {
          //     const buf = parseBuffer(resp);
          //     let decrypted: string;
          //     try {
          //       decrypted = decrypt(sk.secret, buf).toString();
          //     } catch (err) {
          //       console.error("cannot decrypt payload", err);
          //       return;
          //     }

          //     let payload: ProofGenSuccessPayload;
          //     try {
          //       payload = JSON.parse(decrypted) as ProofGenSuccessPayload;
          //     } catch (err) {
          //       console.error("cannot parse payload", err);
          //       return;
          //     }

          //     const proof = payload.receipt[PROOF] as ProveReceipt;
          //     if (proof) {
          //       handleCreateProofResult(proof);
          //     } else {
          //       console.error("no proof delivered");
          //       return;
          //     }
          //   } catch (err) {
          //     console.error(err);
          //   }
          // } else {
          //   console.error("Returned val is empty");
          // }
        });
      } catch (err) {
        setVerifiedStatus(VerifiedStatus.Invalid);
      }
    }
  }, [verifiedStatus, setVerifiedStatus, prfsEmbed, isPrfsReady, tutorialId, openPopup]);

  return (
    <div className={styles.wrapper}>
      <VerifyButton verifiedStatus={verifiedStatus} handleClick={handleClickVerify} />
    </div>
  );
};

export default VerifyProofModule;

export interface VerifyProofModuleProps {
  proofTypeId: string;
  proof: Proof;
}

export interface VerifyButtonProps {
  verifiedStatus: VerifiedStatus;
  handleClick: () => Promise<void>;
}
