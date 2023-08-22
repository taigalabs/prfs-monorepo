import React from "react";
import * as prfsApi from "@taigalabs/prfs-api-js";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import { AiFillTwitterSquare } from "react-icons/ai";
import { BsTelegram } from "react-icons/bs";
import { BiLogoDiscord } from "react-icons/bi";

import styles from "./SocialSharePopover.module.scss";
import { i18nContext } from "@/contexts/i18n";

const SocialSharePopover: React.FC<SocialSharePopoverProps> = () => {
  let i18n = React.useContext(i18nContext);

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
};

export default SocialSharePopover;

export interface SocialSharePopoverProps {}
