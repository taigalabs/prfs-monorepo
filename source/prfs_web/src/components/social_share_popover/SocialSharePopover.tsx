import React from "react";
import * as prfsApi from "@taigalabs/prfs-api-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { AiFillTwitterSquare } from "react-icons/ai";
import { BsTelegram } from "react-icons/bs";
import { BiLogoDiscord } from "react-icons/bi";
import Popover from "@taigalabs/prfs-react-components/src/popover/Popover";
import ArrowButton from "@taigalabs/prfs-react-components/src/arrow_button/ArrowButton";
import { IoMdArrowDropdown } from "react-icons/io";

import styles from "./SocialSharePopover.module.scss";
import { i18nContext } from "@/contexts/i18n";

const SocialSharePopover: React.FC<SocialSharePopoverProps> = () => {
  let i18n = React.useContext(i18nContext);

  const createBase = React.useCallback((isOpen: boolean) => {
    return (
      <div className={styles.base}>
        <Button variant="transparent_aqua_blue_1">
          <span>{i18n.share.toUpperCase()}</span>
          <IoMdArrowDropdown />
        </Button>
      </div>
    );
  }, []);

  const createPopover = React.useCallback(
    (setIsOpen: React.Dispatch<React.SetStateAction<any>>) => {
      // const shortWalletAddr = walletAddr.substring(0, 15);

      return (
        <ul className={styles.popover}>
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
