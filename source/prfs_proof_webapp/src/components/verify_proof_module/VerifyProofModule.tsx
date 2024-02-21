import React from "react";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import cn from "classnames";
import { Proof } from "@taigalabs/prfs-driver-interface";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import {
  API_PATH,
  VerifyProofArgs,
  VerifyProofResultPayload,
  createSession,
  createSessionKey,
  makeVerifyProofSearchParams,
  openPopup,
} from "@taigalabs/prfs-id-sdk-web";
import { useTutorial } from "@taigalabs/prfs-react-lib/src/hooks/tutorial";
import { createRandomKeyPair, decrypt, makeRandInt, toUtf8Bytes } from "@taigalabs/prfs-crypto-js";

import styles from "./VerifyProofModule.module.scss";
import { i18nContext } from "@/i18n/context";
import { envs } from "@/envs";
import { useAppSelector } from "@/state/hooks";

export enum VerifyProofStatus {
  Standby,
  Valid,
  Invalid,
}

const VerifyProofModule: React.FC<VerifyProofModuleProps> = ({ proof, proofTypeId }) => {
  const [verifyProofStatus, setVerifyProofStatus] = React.useState(VerifyProofStatus.Standby);
  const { tutorialId } = useTutorial();
  const i18n = React.useContext(i18nContext);
  const step = useAppSelector(state => state.tutorial.tutorialStep);

  const handleClickVerify = React.useCallback(async () => {
    try {
      const { sk, pkHex } = createRandomKeyPair();
      const session_key = createSessionKey();
      const verifyProofArgs: VerifyProofArgs = {
        nonce: makeRandInt(1000000),
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
      const bytes = toUtf8Bytes(data);

      const popup = openPopup(endpoint);
      if (!popup) {
        return;
      }

      let sessionStream;
      try {
        sessionStream = await createSession({
          key: verifyProofArgs.session_key,
          value: Array.from(bytes),
          ticket: "TICKET",
        });
      } catch (err) {
        console.error(err);
        return;
      }

      const { ws, send, receive } = sessionStream;
      const session = await receive();
      if (!session) {
        console.error("Coudln't get the session, session_key: %s", session_key);
        return;
      }

      try {
        if (session.error) {
          console.error(session.error);
        }

        if (session.payload) {
          if (session.payload.type !== "put_prfs_id_session_value_result") {
            console.error("Wrong session payload type at this point, msg: %s", session.payload);
            return;
          }

          const buf = Buffer.from(session.payload.value);
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

          ws.close();
        }
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
    }
  }, [setVerifyProofStatus, tutorialId]);

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
