import React from "react";
import * as prfsApi from "@taigalabs/prfs-api-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { AiFillTwitterSquare } from "@react-icons/all-files/ai/AiFillTwitterSquare";
import { FaTelegram } from "@react-icons/all-files/fa/FaTelegram";
import { FaDiscord } from "@react-icons/all-files/fa/FaDiscord";
import Popover from "@taigalabs/prfs-react-components/src/popover/Popover";
import { IoMdArrowDropdown } from "@react-icons/all-files/io/IoMdArrowDropdown";

import styles from "./SocialSharePopover.module.scss";
import { i18nContext } from "@/contexts/i18n";

const SocialSharePopover: React.FC<SocialSharePopoverProps> = () => {
  let i18n = React.useContext(i18nContext);

  const createBase = React.useCallback((isOpen: boolean) => {
    return (
      <Button variant="transparent_aqua_blue_1">
        <span>{i18n.share.toUpperCase()}</span>
        <IoMdArrowDropdown />
      </Button>
    );
  }, []);

  const createPopover = React.useCallback(
    (setIsOpen: React.Dispatch<React.SetStateAction<any>>) => {
      return (
        <ul className={styles.popover}>
          <li>
            <AiFillTwitterSquare />
            <span>{i18n.twitter}</span>
          </li>
          <li>
            <FaTelegram />
            <span>{i18n.telegram}</span>
          </li>
          <li>
            <FaDiscord />
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
