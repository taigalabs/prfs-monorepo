import React from "react";
import cn from "classnames";
import type {
  ZAuthMsg,
  SignInSuccessPayload,
  SignInSuccessZAuthMsg,
} from "@taigalabs/prfs-zauth-interface";

import styles from "./SignInButton.module.scss";
import Button from "../button/Button";
import { i18nContext } from "../contexts/i18nContext";

const eventListener = {
  object: null,
};

const SignInButton: React.FC<SignInButtonProps> = ({ prfsSignInEndpoint, handleSucceedSignIn }) => {
  const i18n = React.useContext(i18nContext);

  React.useEffect(() => {
    return () => {
      if (eventListener.object !== null) {
        window.removeEventListener("message", eventListener.object);
      }
    };
  }, []);

  const handleClickSignIn = React.useCallback(() => {
    if (prfsSignInEndpoint) {
      const wd = window.open(prfsSignInEndpoint, "_blank", "toolbar=0,location=0,menubar=0");

      if (wd) {
        const listener = (ev: MessageEvent<any>) => {
          const { origin } = ev;

          if (prfsSignInEndpoint.startsWith(origin)) {
            const data = ev.data as SignInSuccessZAuthMsg;
            if (data.type === "SIGN_IN_SUCCESS") {
              handleSucceedSignIn(data.payload);
            }
          }
        };

        addEventListener("message", listener, false);
      }
    }
  }, [prfsSignInEndpoint]);

  return (
    <Button
      variant="blue_2"
      className={styles.wrapper}
      noTransition
      handleClick={handleClickSignIn}
      noShadow
      disabled={!prfsSignInEndpoint}
    >
      {i18n.sign_in}
    </Button>
  );
};

export default SignInButton;

export interface SignInButtonProps {
  prfsSignInEndpoint: string | null;
  handleSucceedSignIn: (data: SignInSuccessPayload) => void;
}
