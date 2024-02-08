import React from "react";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import cn from "classnames";
import { Proof } from "@taigalabs/prfs-driver-interface";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import { usePopup, usePrfsEmbed } from "@taigalabs/prfs-id-sdk-react";
import {
  API_PATH,
  VerifyProofArgs,
  VerifyProofResultPayload,
  createSession,
  makeVerifyProofSearchParams,
  newPrfsIdMsg,
  parseBuffer,
  sendMsgToChild,
} from "@taigalabs/prfs-id-sdk-web";
import { useRandomKeyPair, useSessionKey } from "@/hooks/key";
import { useTutorial } from "@taigalabs/prfs-react-lib/src/hooks/tutorial";
import { decrypt } from "@taigalabs/prfs-crypto-js";
import { useMutation } from "@tanstack/react-query";

import styles from "./VerifyProofModule.module.scss";
import { i18nContext } from "@/i18n/context";
import { envs } from "@/envs";
import { useAppSelector } from "@/state/hooks";
import { idSessionApi } from "@taigalabs/prfs-api-js";
import { PutSessionValueRequest } from "@taigalabs/prfs-entities/bindings/PutSessionValueRequest";

export enum VerifyProofStatus {
  Standby,
  Valid,
  Invalid,
}

const VerifyProofModule: React.FC<VerifyProofModuleProps> = ({ proof, proofTypeId }) => {
  const [verifyProofStatus, setVerifyProofStatus] = React.useState(VerifyProofStatus.Standby);
  const { openPopup } = usePopup();
  const { prfsEmbed, isReady: isPrfsReady } = usePrfsEmbed();
  const { tutorialId } = useTutorial();
  const { sk, pkHex } = useRandomKeyPair();
  const i18n = React.useContext(i18nContext);
  const step = useAppSelector(state => state.tutorial.tutorialStep);
  const session_key = useSessionKey();
  const { mutateAsync: putSessionValueRequest } = useMutation({
    mutationFn: (req: PutSessionValueRequest) => {
      return idSessionApi({
        type: "put_session_val",
        ...req,
      });
    },
  });

  const handleClickVerify = React.useCallback(async () => {
    try {
      const verifyProofArgs: VerifyProofArgs = {
        nonce: Math.random() * 1000000,
        app_id: "prfs_proof",
        public_key: pkHex,
        proof_type_id: proofTypeId,
        session_key,
      };

      if (tutorialId) {
        verifyProofArgs.tutorial = {
          tutorialId,
          step,
        };
      }
      const searchParams = makeVerifyProofSearchParams(verifyProofArgs);
      const endpoint = `${envs.NEXT_PUBLIC_PRFS_ID_WEBAPP_ENDPOINT}${API_PATH.verify_proof}${searchParams}`;

      const prf = {
        ...proof,
        proofBytes: Array.from(proof.proofBytes),
      };
      const data = JSON.stringify(prf);
      const buf = Buffer.from(data);

      const { payload } = await putSessionValueRequest({
        key: session_key,
        value: [...buf],
        ticket: "TICKET",
      });

      if (!payload) {
        console.error("Failed to upload proof in session, key: %s", session_key);
        return;
      }

      openPopup(endpoint, async () => {
        if (!prfsEmbed || !isPrfsReady) {
          return;
        }

        const { ws, send, receive } = await createSession();
        send({
          type: "OPEN_SESSION",
          key: verifyProofArgs.session_key,
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
            }
          } catch (err) {}
        }
        // const resp = await sendMsgToChild(
        //   newPrfsIdMsg("REQUEST_VERIFY_PROOF", { appId: verifyProofArgs.app_id, data }),
        //   prfsEmbed,
        // );

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

        //     let payload: VerifyProofResultPayload;
        //     try {
        //       payload = JSON.parse(decrypted) as VerifyProofResultPayload;
        //     } catch (err) {
        //       console.error("cannot parse payload", err);
        //       return;
        //     }

        //     if (payload.result) {
        //       setVerifyProofStatus(VerifyProofStatus.Valid);
        //     } else {
        //       setVerifyProofStatus(VerifyProofStatus.Invalid);
        //     }
        //   } catch (err) {
        //     console.error(err);
        //   }
        // } else {
        //   console.error("Returned val is empty");
        // }
        //
      });
    } catch (err) {
      console.error(err);
    }
  }, [
    setVerifyProofStatus,
    prfsEmbed,
    isPrfsReady,
    tutorialId,
    openPopup,
    session_key,
    putSessionValueRequest,
  ]);

  const btnContent = React.useMemo(() => {
    switch (verifyProofStatus) {
      case VerifyProofStatus.Valid:
        return (
          <>
            <FaCheck className={styles.green} />
            <span>{i18n.valid}</span>
          </>
        );
      case VerifyProofStatus.Invalid:
        return (
          <>
            <AiOutlineClose className={styles.red} />
            <span>{i18n.invalid}</span>
          </>
        );
      case VerifyProofStatus.Standby:
      default: {
        return <span>{i18n.verify}</span>;
      }
    }
  }, [verifyProofStatus]);

  return (
    <div className={styles.wrapper}>
      <Button
        variant="transparent_blue_1"
        className={styles.verifyBtn}
        contentClassName={styles.verifyBtnContent}
        handleClick={handleClickVerify}
        smallPadding
      >
        {btnContent}
      </Button>
    </div>
  );
};

export default VerifyProofModule;

export interface VerifyProofModuleProps {
  proofTypeId: string;
  proof: Proof;
}
