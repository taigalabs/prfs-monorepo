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
  createSessionKey,
  makeVerifyProofSearchParams,
  openPopup,
} from "@taigalabs/prfs-id-sdk-web";
import {
  PrivateKey,
  createRandomKeyPair,
  decrypt,
  makeRandInt,
  toUtf8Bytes,
} from "@taigalabs/prfs-crypto-js";
import { usePrfsIdSession } from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/use_prfs_id_session";
import PrfsIdSessionDialog from "@taigalabs/prfs-react-lib/src/prfs_id_session_dialog/PrfsIdSessionDialog";
import { PrfsIdSession } from "@taigalabs/prfs-entities/bindings/PrfsIdSession";

import styles from "./VerifyProofModule.module.scss";
import { i18nContext } from "@/i18n/context";
import { envs } from "@/envs";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { setGlobalError } from "@/state/errorReducer";

export enum VerifyProofStatus {
  Standby,
  Valid,
  Invalid,
}

const VerifyProofModule: React.FC<VerifyProofModuleProps> = ({ proof, proofTypeId }) => {
  const [verifyProofStatus, setVerifyProofStatus] = React.useState(VerifyProofStatus.Standby);
  const i18n = React.useContext(i18nContext);
  const { openPrfsIdSession, isPrfsDialogOpen, setIsPrfsDialogOpen, sessionKey, setSessionKey } =
    usePrfsIdSession();
  const [sk, setSk] = React.useState<PrivateKey | null>(null);
  const dispatch = useAppDispatch();

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

      const { payload: _ } = await openPrfsIdSession({
        key: verifyProofArgs.session_key,
        value: Array.from(bytes),
        ticket: "TICKET",
      });
      setIsPrfsDialogOpen(true);
      setSessionKey(verifyProofArgs.session_key);
      setSk(sk);
    } catch (err) {
      console.error(err);
    }
  }, [setVerifyProofStatus, dispatch, setSk, setSessionKey, setIsPrfsDialogOpen]);

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

      const buf = Buffer.from(session.value);
      let decrypted: string;
      try {
        decrypted = decrypt(sk.secret, buf).toString();
      } catch (err) {
        dispatch(
          setGlobalError({
            message: `Cannot decrypt session, err: ${err}`,
          }),
        );
        return;
      }

      let payload: VerifyProofResultPayload;
      try {
        payload = JSON.parse(decrypted) as VerifyProofResultPayload;
      } catch (err) {
        dispatch(
          setGlobalError({
            message: `Cannot parse proof payload, err: ${err}`,
          }),
        );
        return;
      }

      if (payload.result) {
        setVerifyProofStatus(VerifyProofStatus.Valid);
      } else {
        setVerifyProofStatus(VerifyProofStatus.Invalid);
      }
    },
    [sk, dispatch],
  );

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
  }, [verifyProofStatus, sk]);

  return (
    <>
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

export default VerifyProofModule;

export interface VerifyProofModuleProps {
  proofTypeId: string;
  proof: Proof;
}
