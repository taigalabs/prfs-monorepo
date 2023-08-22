import React from "react";
import * as prfsApi from "@taigalabs/prfs-api-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { AiFillTwitterSquare } from "react-icons/ai";
import { BsTelegram } from "react-icons/bs";
import { BiLogoDiscord } from "react-icons/bi";
import Popover from "@taigalabs/prfs-react-components/src/popover/Popover";

import styles from "./SocialSharePopover.module.scss";
import { i18nContext } from "@/contexts/i18n";

const SocialSharePopover: React.FC<SocialSharePopoverProps> = () => {
  let i18n = React.useContext(i18nContext);

  const createBase = React.useCallback((isOpen: boolean) => {
    return <div>power</div>;

    // const { sig, avatar_color } = prfsAccount;
    // const s = sig.substring(2, 6);
    // const avatarColor = `#${avatar_color}`;

    // return (
    //   <div className={styles.base} style={{ backgroundColor: avatarColor }}>
    //     <div className={styles.id}>{s}</div>
    //   </div>
    //   // {/* <div className={styles.wallet}>{/* <BsWallet2 /> */}</div> */}
    // );
  }, []);

  const createPopover = React.useCallback(
    (setIsOpen: React.Dispatch<React.SetStateAction<any>>) => {
      // const shortWalletAddr = walletAddr.substring(0, 15);

      return (
        <ul className={styles.wrapper}>
          <li>
            <AiFillTwitterSquare />
            <span>{i18n.twitter}</span>
          </li>
          <li>
            <BsTelegram />
            <span>{i18n.telegram}</span>
          </li>
          <li>
            <BiLogoDiscord />
            <span>{i18n.discord}</span>
          </li>
        </ul>
      );
    },
    []
  );

  return <Popover createBase={createBase} createPopover={createPopover} />;
};

export default SocialSharePopover;

export interface SocialSharePopoverProps {}
