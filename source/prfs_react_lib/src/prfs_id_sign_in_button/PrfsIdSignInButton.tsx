import React from "react";
import cn from "classnames";
import {
  API_PATH,
  AppSignInArgs,
  makeAppSignInSearchParams,
  createSession,
  openPopup,
  ProofGenArgs,
  makeProofGenSearchParams,
} from "@taigalabs/prfs-id-sdk-web";

import styles from "./PrfsIdSignInButton.module.scss";
import Button from "../button/Button";
import { i18nContext } from "../i18n/i18nContext";
import Overlay from "../overlay/Overlay";
import Spinner from "../spinner/Spinner";

const PrfsIdSignInButton: React.FC<PrfsIdSignInButtonProps> = ({
  className,
  label,
  // appSignInArgs,
  proofGenArgs,
  handleSucceedSignIn,
  prfsIdEndpoint,
  isLoading,
}) => {
  const i18n = React.useContext(i18nContext);

  const handleClickSignIn = React.useCallback(async () => {
    // const searchParams = makeAppSignInSearchParams(appSignInArgs);
    const searchParams = makeProofGenSearchParams(proofGenArgs);
    // const endpoint = `${prfsIdEndpoint}${API_PATH.app_sign_in}${searchParams}`;
    const endpoint = `${prfsIdEndpoint}${API_PATH.proof_gen}${searchParams}`;

    const popup = openPopup(endpoint);
    if (!popup) {
      return;
    }

    let sessionStream;
    try {
      sessionStream = await createSession({
        // key: appSignInArgs.session_key,
        key: proofGenArgs.session_key,
        value: null,
        ticket: "TICKET",
      });
    } catch (err) {
      console.error(err);
      return;
    }

    if (!sessionStream) {
      console.error("Couldn't open a session");
      return;
    }

    const { ws, send, receive } = sessionStream;
    const session = await receive();
    if (session) {
      try {
        if (session.error) {
          console.error(session.error);
        }

        if (session.payload) {
          if (session.payload.type !== "put_prfs_id_session_value_result") {
            console.error("Wrong sesseion type at this point. Payload: %s", session.payload);
            return;
          }

          if (session.payload.value.length === 0) {
            return;
          }

          const buf = Buffer.from(session.payload.value);
          handleSucceedSignIn(buf);

          send({
            type: "close_prfs_id_session",
            // key: appSignInArgs.session_key,
            key: proofGenArgs.session_key,
            ticket: "TICKET",
          });

          const closeSessionResp = await receive();
          if (!closeSessionResp) {
            console.error("Could get the close sessionr response");
          }
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error(
        "Session didn't get the response, something's wrong, session key: %s",
        // appSignInArgs.session_key,
        proofGenArgs.session_key,
      );
    }

    ws.close();
  }, [
    // appSignInArgs,
    proofGenArgs,
    prfsIdEndpoint,
    handleSucceedSignIn,
  ]);

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
  // appSignInArgs: AppSignInArgs;
  proofGenArgs: ProofGenArgs;
  isLoading?: boolean;
  handleSucceedSignIn: (encrypted: Buffer) => void;
  prfsIdEndpoint: string;
}
