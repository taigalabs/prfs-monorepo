import React from "react";
import cn from "classnames";
import { BsPersonFill } from "@react-icons/all-files/bs/BsPersonFill";
import { FaAddressCard } from "@react-icons/all-files/fa/FaAddressCard";

import styles from "./ShySignInModal.module.scss";
import { useShyI18N } from "@/i18n";

const ShySignInModal: React.FC<ShySignInModalProps> = ({}) => {
  const i18n = useShyI18N();

  return (
    <ul className={styles.wrapper}>
      <li className={styles.item}>
        <img
          className={styles.prfsLogo}
          src="https://d1w1533jipmvi2.cloudfront.net/logo_p_lato_192.png"
          alt="Prfs"
        />
        <span>{i18n.sign_in_via_prfs}</span>
      </li>
    </ul>
  );
};

export default ShySignInModal;

export interface ShySignInModalProps {}
