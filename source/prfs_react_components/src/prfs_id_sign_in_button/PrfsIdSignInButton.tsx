import React from "react";
import cn from "classnames";
import {
  API_PATH,
  AppSignInArgs,
  makeAppSignInSearchParams,
  newPrfsIdMsg,
  sendMsgToChild,
  parseBuffer,
} from "@taigalabs/prfs-id-sdk-web";
import { usePopup, usePrfsEmbed } from "@taigalabs/prfs-id-sdk-react";

import styles from "./PrfsIdSignInButton.module.scss";
import colors from "../colors.module.scss";
import Spinner from "../spinner/Spinner";
import Button from "../button/Button";
import { i18nContext } from "../i18n/i18nContext";

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
  const { prfsEmbed, isReady: isPrfsReady } = usePrfsEmbed();
  const { openPopup, isOpen } = usePopup();

  const handleClickSignIn = React.useCallback(async () => {
    const searchParams = makeAppSignInSearchParams(appSignInArgs);
    const endpoint = `${prfsIdEndpoint}${API_PATH.app_sign_in}${searchParams}`;

    openPopup(endpoint, async () => {
      if (!prfsEmbed || !isPrfsReady) {
        return;
      }

      const resp = await sendMsgToChild(
        newPrfsIdMsg("REQUEST_SIGN_IN", { appId: appSignInArgs.appId }),
        prfsEmbed,
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
    });
  }, [
    appSignInArgs,
    prfsIdEndpoint,
    prfsEmbedEndpoint,
    isPrfsReady,
    handleSucceedSignIn,
    openPopup,
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
        {isOpen && <Spinner size={20} color={colors.white_100} borderWidth={2} />}
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
