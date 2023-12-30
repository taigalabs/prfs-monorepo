import React from "react";
import cn from "classnames";
import {
  API_PATH,
  AppSignInArgs,
  PrfsIdMsg,
  createEmbeddedElem,
  makeAppSignInSearchParams,
  newPrfsIdMsg,
  sendMsgToChild,
  parseBuffer,
} from "@taigalabs/prfs-id-sdk-web";

import styles from "./PrfsIdSignInButton.module.scss";
import colors from "../colors.module.scss";
import Spinner from "../spinner/Spinner";
import Button from "../button/Button";
import { i18nContext } from "../i18n/i18nContext";
import { usePrfsEmbed } from "@taigalabs/prfs-id-sdk-react";

enum SignInStatus {
  Standby,
  InProgress,
}

const PrfsIdSignInButton: React.FC<PrfsIdSignInButtonProps> = ({
  className,
  label,
  appId,
  appSignInArgs,
  handleSucceedSignIn,
  prfsIdEndpoint,
  prfsEmbedEndpoint,
}) => {
  const i18n = React.useContext(i18nContext);
  const [status, setStatus] = React.useState(SignInStatus.Standby);
  const closeTimerRef = React.useRef<NodeJS.Timer | null>(null);
  const { childRef, isReady: isPrfsReady } = usePrfsEmbed({
    appId,
    prfsEmbedEndpoint,
  });

  React.useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearInterval(closeTimerRef.current);
      }
    };
  }, []);

  const handleClickSignIn = React.useCallback(async () => {
    const searchParams = makeAppSignInSearchParams(appSignInArgs);
    const endpoint = `${prfsIdEndpoint}${API_PATH.app_sign_in}${searchParams}`;

    if (!isPrfsReady || !childRef.current) {
      return;
    }

    // Open the window
    setStatus(SignInStatus.InProgress);
    const child = window.open(endpoint, "_blank", "toolbar=0,location=0,menubar=0");
    if (!child) {
      console.error("Failed to open window");
      setStatus(SignInStatus.Standby);
      return;
    }

    if (!closeTimerRef.current) {
      const timer = setInterval(() => {
        if (child.closed) {
          setStatus(SignInStatus.Standby);
        }
      }, 4000);
      closeTimerRef.current = timer;
    }

    const resp = await sendMsgToChild(
      newPrfsIdMsg("REQUEST_SIGN_IN", { storageKey: appSignInArgs.publicKey }),
      childRef.current,
    );
    if (resp) {
      try {
        const buf = parseBuffer(resp);
        handleSucceedSignIn(buf);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Returned val is empty");
    }
  }, [
    appSignInArgs,
    setStatus,
    prfsIdEndpoint,
    prfsEmbedEndpoint,
    isPrfsReady,
    handleSucceedSignIn,
  ]);

  return (
    <Button
      variant="blue_2"
      className={cn(styles.btn, className)}
      noTransition
      handleClick={handleClickSignIn}
      noShadow
      disabled={!isPrfsReady}
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
  appId: string;
  appSignInArgs: AppSignInArgs;
  handleSucceedSignIn: (encrypted: Buffer) => void;
  prfsIdEndpoint: string;
  prfsEmbedEndpoint: string;
}
