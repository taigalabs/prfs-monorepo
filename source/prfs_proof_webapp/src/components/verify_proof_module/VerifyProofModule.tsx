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
  VerifyProofResultPayload,
  makeVerifyProofSearchParams,
  newPrfsIdMsg,
  parseBuffer,
  sendMsgToChild,
} from "@taigalabs/prfs-id-sdk-web";
import { useRandomKeyPair } from "@/hooks/key";
import { useTutorial } from "@taigalabs/prfs-react-lib/src/hooks/tutorial";
import { decrypt } from "@taigalabs/prfs-crypto-js";

import styles from "./VerifyProofModule.module.scss";
import { i18nContext } from "@/i18n/context";
import { envs } from "@/envs";
import { useAppSelector } from "@/state/hooks";

export enum VerifyProofStatus {
  Standby,
  Valid,
  Invalid,
}

// const VerifyButton: React.FC<VerifyButtonProps> = ({ verifiedStatus, handleClick }) => {
//   const i18n = React.useContext(i18nContext);

//   switch (verifiedStatus) {
//     case VerifyProofStatus.Valid:
//       return (
//         <Button variant="transparent_black_1" className={styles.validBtn} smallPadding>
//           <FaCheck />
//           <span>{i18n.verified}</span>
//         </Button>
//       );

//     case VerifyProofStatus.Invalid:
//       return (
//         <Button variant="transparent_black_1" className={styles.invalidBtn} smallPadding>
//           <AiOutlineClose />
//           <span>{i18n.invalid}</span>
//         </Button>
//       );

//     default:
//       return (
//         <Button
//           variant="transparent_blue_1"
//           className={styles.verifyBtn}
//           handleClick={handleClick}
//           smallPadding
//         >
//           {i18n.verify}
//         </Button>
//       );
//   }
// };

const VerifyProofModule: React.FC<VerifyProofModuleProps> = ({ proof, proofTypeId }) => {
  const [verifyProofStatus, setVerifyProofStatus] = React.useState(VerifyProofStatus.Standby);
  const { openPopup } = usePopup();
  const { prfsEmbed, isReady: isPrfsReady } = usePrfsEmbed();
  const { tutorialId } = useTutorial();
  const { sk, pkHex } = useRandomKeyPair();
  const i18n = React.useContext(i18nContext);
  const step = useAppSelector(state => state.tutorial.tutorialStep);

  const handleClickVerify = React.useCallback(async () => {
    try {
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

        const prf = {
          ...proof,
          proofBytes: Array.from(proof.proofBytes),
        };
        const data = JSON.stringify(prf);
        const resp = await sendMsgToChild(
          newPrfsIdMsg("REQUEST_VERIFY_PROOF", { appId: verifyProofArgs.app_id, data }),
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

            let payload: VerifyProofResultPayload;
            try {
              payload = JSON.parse(decrypted) as VerifyProofResultPayload;
            } catch (err) {
              console.error("cannot parse payload", err);
              return;
            }

            if (payload.result) {
              setVerifyProofStatus(VerifyProofStatus.Valid);
            } else {
              setVerifyProofStatus(VerifyProofStatus.Invalid);
            }
          } catch (err) {
            console.error(err);
          }
        } else {
          console.error("Returned val is empty");
        }
      });
    } catch (err) {
      console.error(err);
    }
  }, [setVerifyProofStatus, prfsEmbed, isPrfsReady, tutorialId, openPopup]);

  const btnContent = React.useMemo(() => {
    switch (verifyProofStatus) {
      case VerifyProofStatus.Valid:
        return (
          <>
            <span>{i18n.valid}</span>
          </>
        );
      case VerifyProofStatus.Invalid:
        return (
          <>
            <span>{i18n.invalid}</span>
          </>
        );
      case VerifyProofStatus.Standby:
      default: {
        return <span>{i18n.verify}</span>;
      }
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <Button
        variant="transparent_blue_1"
        className={styles.verifyBtn}
        handleClick={handleClickVerify}
        smallPadding
      >
        {btnContent}
        {/* {i18n.verify} */}
      </Button>
    </div>
  );
};

export default VerifyProofModule;

export interface VerifyProofModuleProps {
  proofTypeId: string;
  proof: Proof;
}

// export interface VerifyButtonProps {
//   verifyP: VerifiedStatus;
//   handleClick: () => Promise<void>;
// }
