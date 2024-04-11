import React from "react";
import cn from "classnames";
import {
  API_PATH,
  openPopup,
  ProofGenArgs,
  makeProofGenSearchParams,
  createSessionKey,
  AppSignInType,
  QueryType,
  AppSignInData,
  ProofGenSuccessPayload,
  AppSignInResult,
} from "@taigalabs/prfs-id-sdk-web";
import { PrivateKey, createRandomKeyPair, decrypt, makeRandInt } from "@taigalabs/prfs-crypto-js";
import { PrfsIdSession } from "@taigalabs/prfs-entities/bindings/PrfsIdSession";

import styles from "./PrfsIdSignInButton.module.scss";
import Button from "../button/Button";
import { i18nContext } from "../i18n/i18nContext";
import Overlay from "../overlay/Overlay";
import Spinner from "../spinner/Spinner";
import { usePrfsIdSession } from "../prfs_id_session_dialog/use_prfs_id_session";
import PrfsIdSessionDialog from "../prfs_id_session_dialog/PrfsIdSessionDialog";

const SIGN_IN = "SIGN_IN";

const PrfsIdSignInButton: React.FC<PrfsIdSignInButtonProps> = ({
  className,
  appId,
  label,
  handleSucceedSignIn,
  handleSignInError,
  prfsIdEndpoint,
  isLoading,
}) => {
  const i18n = React.useContext(i18nContext);
  const {
    openPrfsIdSession,
    isPrfsDialogOpen,
    setIsPrfsDialogOpen,
    sessionKey,
    setSessionKey,
    sk,
    setSk,
  } = usePrfsIdSession();
  // const [sk, setSk] = React.useState<PrivateKey | null>(null);

  const handleClickSignIn = React.useCallback(async () => {
    const { sk, pkHex } = createRandomKeyPair();
    const session_key = createSessionKey();
    const proofGenArgs: ProofGenArgs = {
      nonce: makeRandInt(1000000),
      app_id: appId,
      queries: [
        {
          name: SIGN_IN,
          type: AppSignInType.EC_SECP256K1,
          queryType: QueryType.APP_SIGN_IN,
          appSignInData: [AppSignInData.ID_POSEIDON],
        },
      ],
      public_key: pkHex,
      session_key,
    };

    const searchParams = makeProofGenSearchParams(proofGenArgs);
    const endpoint = `${prfsIdEndpoint}${API_PATH.proof_gen}${searchParams}`;

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
    prfsIdEndpoint,
    handleSucceedSignIn,
    setSk,
    openPrfsIdSession,
    setSessionKey,
    setIsPrfsDialogOpen,
  ]);

  const handleSucceedGetSession = React.useCallback(
    (session: PrfsIdSession) => {
      if (!sk) {
        handleSignInError("Secret key is not set to decrypt Prfs ID session");
        return;
      }

      const buf = Buffer.from(session.value);
      let decrypted: string;
      try {
        decrypted = decrypt(sk.secret, buf).toString();
      } catch (err) {
        handleSignInError(`Cannot decrypt payload, err: ${err}`);
        return;
      }

      let payload: ProofGenSuccessPayload;
      try {
        payload = JSON.parse(decrypted) as ProofGenSuccessPayload;
      } catch (err) {
        handleSignInError(`Cannot parse proof payload, err: ${err}`);
        return;
      }

      const signInResult: AppSignInResult = payload.receipt[SIGN_IN];
      if (signInResult) {
        handleSucceedSignIn(signInResult);
      } else {
        handleSignInError(`appSignInResult is void, session_key: ${sessionKey}`);
        return;
      }
    },
    [sk, sessionKey, handleSucceedSignIn, handleSignInError],
  );

  return (
    <>
      <Button
        variant="blue_3"
        className={cn(styles.btn, className)}
        noTransition
        handleClick={handleClickSignIn}
        noShadow
      >
        <div className={styles.wrapper}>
          {isLoading ? (
            <Overlay>
              <Spinner size={18} color="#5c5c5c" />
            </Overlay>
          ) : (
            <span>{label ? label : i18n.sign_in}</span>
          )}
        </div>
      </Button>
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

export default PrfsIdSignInButton;

export interface PrfsIdSignInButtonProps {
  className?: string;
  label?: string;
  appId: string;
  isLoading?: boolean;
  handleSucceedSignIn: (signInResult: AppSignInResult) => void;
  handleSignInError: (err: string) => void;
  prfsIdEndpoint: string;
}
