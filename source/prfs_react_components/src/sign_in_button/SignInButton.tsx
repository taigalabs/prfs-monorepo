import React from "react";
import cn from "classnames";
import {
  type ZAuthMsg,
  type SignInSuccessPayload,
  type SignInSuccessZAuthMsg,
  newZAuthMsg,
} from "@taigalabs/prfs-zauth-interface";

import styles from "./SignInButton.module.scss";
import Button from "../button/Button";
import { i18nContext } from "../contexts/i18nContext";

// const eventListener = {
//   object: null,
// };

const SignInButton: React.FC<SignInButtonProps> = ({ prfsSignInEndpoint, handleSucceedSignIn }) => {
  const i18n = React.useContext(i18nContext);

  React.useEffect(() => {
    const listener = (ev: MessageEvent<any>) => {
      const { origin } = ev;

      if (prfsSignInEndpoint && prfsSignInEndpoint.startsWith(origin)) {
        const data = ev.data as SignInSuccessZAuthMsg;
        if (data.type === "SIGN_IN_SUCCESS") {
          console.log(11, data.payload);

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
  }, [prfsSignInEndpoint]);

  const handleClickSignIn = React.useCallback(() => {
    if (prfsSignInEndpoint) {
      window.open(prfsSignInEndpoint, "_blank", "toolbar=0,location=0,menubar=0");
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
  handleSucceedSignIn: (encrypted: string) => void;
}
