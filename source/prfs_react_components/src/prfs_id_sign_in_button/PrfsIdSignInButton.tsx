import React from "react";
import cn from "classnames";
import { PrfsIdMsg, newPrfsIdMsg } from "@taigalabs/prfs-id-sdk-web";

import styles from "./PrfsIdSignInButton.module.scss";
import Button from "../button/Button";
import { i18nContext } from "../i18n/i18nContext";

const PrfsIdSignInButton: React.FC<PrfsIdSignInButtonProps> = ({
  className,
  label,
  prfsIdSignInEndpoint,
  handleSucceedSignIn,
}) => {
  const i18n = React.useContext(i18nContext);

  React.useEffect(() => {
    const listener = (ev: MessageEvent<any>) => {
      const { origin } = ev;

      if (prfsIdSignInEndpoint && prfsIdSignInEndpoint.startsWith(origin)) {
        const data = ev.data as PrfsIdMsg<Buffer>;
        if (data.type === "SIGN_IN_SUCCESS") {
          const msg = newPrfsIdMsg("SIGN_IN_SUCCESS_RESPOND", null);
          ev.ports[0].postMessage(msg);
          handleSucceedSignIn(data.payload);
        }
      }
    };
    addEventListener("message", listener, false);

    return () => {
      window.removeEventListener("message", listener);
    };
  }, [prfsIdSignInEndpoint, handleSucceedSignIn]);

  const handleClickSignIn = React.useCallback(() => {
    if (prfsIdSignInEndpoint) {
      window.open(prfsIdSignInEndpoint, "_blank", "toolbar=0,location=0,menubar=0");
    }
  }, [prfsIdSignInEndpoint]);

  return (
    <Button
      variant="blue_2"
      className={cn(styles.wrapper, className)}
      noTransition
      handleClick={handleClickSignIn}
      noShadow
      disabled={!prfsIdSignInEndpoint}
    >
      {label ? label : i18n.sign_in}
    </Button>
  );
};

export default PrfsIdSignInButton;

export interface PrfsIdSignInButtonProps {
  className?: string;
  label?: string;
  prfsIdSignInEndpoint: string | null;
  handleSucceedSignIn: (encrypted: Buffer) => void;
}
