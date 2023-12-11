import React from "react";
import cn from "classnames";
import {
  type ZAuthMsg,
  type SignInSuccessPayload,
  type SignInSuccessZAuthMsg,
  newZAuthMsg,
} from "@taigalabs/prfs-id-sdk-web";

import styles from "./PrfsIdSignInButton.module.scss";
import Button from "../button/Button";
import { i18nContext } from "../contexts/i18nContext";

const PrfsIdSignInButton: React.FC<PrfsIdSignInButtonProps> = ({
  prfsIdSignInEndpoint,
  handleSucceedSignIn,
}) => {
  const i18n = React.useContext(i18nContext);

  React.useEffect(() => {
    const listener = (ev: MessageEvent<any>) => {
      const { origin } = ev;

      if (prfsIdSignInEndpoint && prfsIdSignInEndpoint.startsWith(origin)) {
        const data = ev.data as SignInSuccessZAuthMsg;
        if (data.type === "SIGN_IN_SUCCESS") {
          const msg = newZAuthMsg("SIGN_IN_SUCCESS_RESPOND", null);
          ev.ports[0].postMessage(msg);

          handleSucceedSignIn(data.payload);
        }
      }
    };
    addEventListener("message", listener, false);

    return () => {
      console.log("off render");
      window.removeEventListener("message", listener);
    };
  }, [prfsIdSignInEndpoint]);

  const handleClickSignIn = React.useCallback(() => {
    if (prfsIdSignInEndpoint) {
      window.open(prfsIdSignInEndpoint, "_blank", "toolbar=0,location=0,menubar=0");
    }
  }, [prfsIdSignInEndpoint]);

  return (
    <Button
      variant="blue_2"
      className={styles.wrapper}
      noTransition
      handleClick={handleClickSignIn}
      noShadow
      disabled={!prfsIdSignInEndpoint}
    >
      {i18n.sign_in}
    </Button>
  );
};

export default PrfsIdSignInButton;

export interface PrfsIdSignInButtonProps {
  prfsIdSignInEndpoint: string | null;
  handleSucceedSignIn: (encrypted: Buffer) => void;
}
