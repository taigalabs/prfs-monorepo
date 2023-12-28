import React from "react";
import cn from "classnames";
import {
  APP_SIGN_IN_PATH,
  AppSignInArgs,
  PrfsIdMsg,
  makeAppSignInSearchParams,
  newPrfsIdMsg,
  sendMsgToPopup,
} from "@taigalabs/prfs-id-sdk-web";

import styles from "./PrfsIdSignInButton.module.scss";
import colors from "../colors.module.scss";
import Spinner from "../spinner/Spinner";
import Button from "../button/Button";
import { i18nContext } from "../i18n/i18nContext";

enum SignInStatus {
  Standby,
  InProgress,
}

const PrfsIdSignInButton: React.FC<PrfsIdSignInButtonProps> = ({
  className,
  label,
  appSignInArgs,
  handleSucceedSignIn,
  prfsIdAppSignInEndpoint,
}) => {
  const i18n = React.useContext(i18nContext);
  const [status, setStatus] = React.useState(SignInStatus.Standby);
  const msgListenerRef = React.useRef<((ev: MessageEvent) => void) | null>(null);
  const closeTimerRef = React.useRef<NodeJS.Timer | null>(null);

  React.useEffect(() => {
    return () => {
      if (msgListenerRef.current) {
        window.removeEventListener("message", msgListenerRef.current);
      }
      if (closeTimerRef.current) {
        clearInterval(closeTimerRef.current);
      }
    };
  }, []);

  const handleClickSignIn = React.useCallback(() => {
    const searchParams = makeAppSignInSearchParams(appSignInArgs);
    const endpoint = `${prfsIdAppSignInEndpoint}${APP_SIGN_IN_PATH}${searchParams}`;

    if (!msgListenerRef.current) {
      const listener = (ev: MessageEvent<any>) => {
        const { origin } = ev;
        if (endpoint.startsWith(origin)) {
          const data = ev.data as PrfsIdMsg<Buffer>;
          if (data.type === "SIGN_IN_SUCCESS") {
            if (closeTimerRef.current) {
              clearInterval(closeTimerRef.current);
            }

            const msg = newPrfsIdMsg("SIGN_IN_SUCCESS_RESPOND", null);
            ev.ports[0].postMessage(msg);
            handleSucceedSignIn(data.payload);
          }
        }
      };
      addEventListener("message", listener, false);
      msgListenerRef.current = listener;
    }

    // Open the window
    setStatus(SignInStatus.InProgress);
    const child = window.open(endpoint, "_blank", "toolbar=0,location=0,menubar=0");
    // window["ttt"] = child;

    if (!closeTimerRef.current) {
      const fn = setInterval(() => {
        if (child) {
          if (child.closed) {
            setStatus(SignInStatus.Standby);
          }
        }
      }, 4000);

      closeTimerRef.current = fn;
    }

    if (child) {
      console.log("register send");
      setInterval(() => {
        console.log("send");
        child.postMessage("power", "*");
        // sendMsgToPopup(child, "power" as any);
      }, 2000);
    }
  }, [appSignInArgs, setStatus, prfsIdAppSignInEndpoint]);

  return (
    <Button
      variant="blue_2"
      className={cn(styles.btn, className)}
      noTransition
      handleClick={handleClickSignIn}
      noShadow
    >
      <div className={styles.wrapper}>
        <span>{label ? label : i18n.sign_in}</span>
        {status === SignInStatus.InProgress && <Spinner size={20} color={colors.white_100} />}
      </div>
    </Button>
  );
};

export default PrfsIdSignInButton;

export interface PrfsIdSignInButtonProps {
  className?: string;
  label?: string;
  appSignInArgs: AppSignInArgs;
  handleSucceedSignIn: (encrypted: Buffer) => void;
  prfsIdAppSignInEndpoint: string;
}
