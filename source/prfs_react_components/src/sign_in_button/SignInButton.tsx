import React from "react";
import cn from "classnames";
import { encrypt, decrypt, PrivateKey } from "eciesjs";

import styles from "./SignInButton.module.scss";
import Button from "../button/Button";
import { i18nContext } from "../contexts/i18nContext";

const SignInButton: React.FC<SignInButtonProps> = ({ prfsSignInEndpoint }) => {
  const i18n = React.useContext(i18nContext);

  const handleClickSignIn = React.useCallback(() => {
    if (prfsSignInEndpoint) {
      const wd = window.open(prfsSignInEndpoint, "_blank", "toolbar=0,location=0,menubar=0");

      if (wd) {
        wd.onmessage = ev => {
          console.log(111, ev);
        };
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
}
