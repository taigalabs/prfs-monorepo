import React from "react";
import cn from "classnames";
import { PrfsIdMsg, newPrfsIdMsg } from "@taigalabs/prfs-id-sdk-web";

import styles from "./PrfsIdSignInButton.module.scss";
import colors from "../colors.module.scss";
import Spinner from "../spinner/Spinner";
import Button from "../button/Button";
import { i18nContext } from "../i18n/i18nContext";

enum SignInStatus {
  Standby,
  InProgress,
}

const childWindowCloseListener: { ref: NodeJS.Timer | null } = {
  ref: null,
};

const PrfsIdSignInButton: React.FC<PrfsIdSignInButtonProps> = ({
  className,
  label,
  prfsIdSignInEndpoint,
  handleSucceedSignIn,
}) => {
  const i18n = React.useContext(i18nContext);
  const [status, setStatus] = React.useState(SignInStatus.Standby);

  React.useEffect(() => {
    const listener = (ev: MessageEvent<any>) => {
      const { origin } = ev;

      if (prfsIdSignInEndpoint && prfsIdSignInEndpoint.startsWith(origin)) {
        const data = ev.data as PrfsIdMsg<Buffer>;
        if (data.type === "SIGN_IN_SUCCESS") {
          if (childWindowCloseListener.ref) {
            clearInterval(childWindowCloseListener.ref);
          }

          const msg = newPrfsIdMsg("SIGN_IN_SUCCESS_RESPOND", null);
          ev.ports[0].postMessage(msg);
          handleSucceedSignIn(data.payload);
        }
      }
    };
    addEventListener("message", listener, false);

    return () => {
      window.removeEventListener("message", listener);

      if (childWindowCloseListener.ref) {
        clearInterval(childWindowCloseListener.ref);
      }
    };
  }, [prfsIdSignInEndpoint, handleSucceedSignIn]);

  const handleClickSignIn = React.useCallback(() => {
    if (prfsIdSignInEndpoint) {
      setStatus(SignInStatus.InProgress);
      const child = window.open(prfsIdSignInEndpoint, "_blank", "toolbar=0,location=0,menubar=0");

      if (!childWindowCloseListener.ref) {
        const fn = setInterval(() => {
          if (child) {
            if (child.closed) {
              setStatus(SignInStatus.Standby);
            }
          }
        }, 4000);

        childWindowCloseListener.ref = fn;
      }
    }
  }, [prfsIdSignInEndpoint, setStatus]);

  return (
    <Button
      variant="blue_2"
      className={cn(styles.btn, className)}
      noTransition
      handleClick={handleClickSignIn}
      noShadow
      disabled={!prfsIdSignInEndpoint}
    >
      <div className={styles.wrapper}>
        {status === SignInStatus.InProgress && <Spinner size={20} color={colors.white_100} />}
        <span>{label ? label : i18n.sign_in}</span>
      </div>
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
