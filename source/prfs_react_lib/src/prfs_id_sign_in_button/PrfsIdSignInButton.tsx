import React from "react";
import cn from "classnames";
import {
  API_PATH,
  createSession,
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
import { createRandomKeyPair, decrypt, makeRandInt } from "@taigalabs/prfs-crypto-js";

import styles from "./PrfsIdSignInButton.module.scss";
import Button from "../button/Button";
import { i18nContext } from "../i18n/i18nContext";
import Overlay from "../overlay/Overlay";
import Spinner from "../spinner/Spinner";

const SIGN_IN = "SIGN_IN";

const PrfsIdSignInButton: React.FC<PrfsIdSignInButtonProps> = ({
  className,
  label,
  // proofGenArgs,
  handleSucceedSignIn,
  handleSignInError,
  prfsIdEndpoint,
  isLoading,
}) => {
  const i18n = React.useContext(i18nContext);

  const handleClickSignIn = React.useCallback(async () => {
    // const [sk, proofGenArgs] = React.useMemo<[PrivateKey, ProofGenArgs]>(() => {
    const { sk, pkHex } = createRandomKeyPair();
    const session_key = createSessionKey();
    const proofGenArgs: ProofGenArgs = {
      nonce: makeRandInt(1000000),
      app_id: "shy_webapp",
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

    // return [sk, proofGenArgs];
    // }, []);

    const searchParams = makeProofGenSearchParams(proofGenArgs);
    const endpoint = `${prfsIdEndpoint}${API_PATH.proof_gen}${searchParams}`;

    const popup = openPopup(endpoint);
    if (!popup) {
      return;
    }

    let sessionStream;
    try {
      sessionStream = await createSession({
        key: proofGenArgs.session_key,
        value: null,
        ticket: "TICKET",
      });
    } catch (err: any) {
      handleSignInError(err.toString());
      return;
    }
    if (!sessionStream) {
      handleSignInError("Couldn't open a session");
      return;
    }

    const { ws, send, receive } = sessionStream;
    const session = await receive();
    if (session) {
      try {
        if (session.error) {
          handleSignInError(session.error);
          ws.close();
          return;
        }

        if (session.payload) {
          if (session.payload.type !== "put_prfs_id_session_value_result") {
            handleSignInError(`Wrong sesseion type at this point. Payload: ${session.payload}`);
            ws.close();
            return;
          }

          if (session.payload.value.length === 0) {
            ws.close();
            return;
          }

          const encrypted = Buffer.from(session.payload.value);
          let decrypted: string;
          try {
            decrypted = decrypt(sk.secret, encrypted).toString();
          } catch (err) {
            handleSignInError(`Failed to decrypt, err: ${err}, msg: ${encrypted}`);
            ws.close();
            return;
          }

          let proofGenSuccessPayload: ProofGenSuccessPayload;
          try {
            proofGenSuccessPayload = JSON.parse(decrypted) as ProofGenSuccessPayload;
          } catch (err) {
            handleSignInError(`Cannot parse sign in payload, msg: ${decrypted}`);
            ws.close();
            return;
          }

          const signInResult: AppSignInResult = proofGenSuccessPayload.receipt[SIGN_IN];

          send({
            type: "close_prfs_id_session",
            key: proofGenArgs.session_key,
            ticket: "TICKET",
          });
          ws.close();

          if (signInResult) {
            handleSucceedSignIn(signInResult);
          } else {
            handleSignInError(`appSignInResult is void, session_key: ${session_key}`);
          }
        }
      } catch (err) {
        handleSignInError("Error handling session response");
        ws.close();
        return;
      }
    } else {
      handleSignInError(
        `Session didn't get the response, something's wrong, session key: \
${proofGenArgs.session_key}`,
      );
    }

    ws.close();
  }, [prfsIdEndpoint, handleSucceedSignIn]);

  return (
    <Button
      variant="blue_2"
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
  );
};

export default PrfsIdSignInButton;

export interface PrfsIdSignInButtonProps {
  className?: string;
  label?: string;
  appId: String;
  // proofGenArgs: ProofGenArgs;
  isLoading?: boolean;
  handleSucceedSignIn: (signInResult: AppSignInResult) => void;
  handleSignInError: (err: string) => void;
  prfsIdEndpoint: string;
}
