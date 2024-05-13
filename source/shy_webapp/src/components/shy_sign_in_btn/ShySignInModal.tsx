import React from "react";
import cn from "classnames";
import { BsPersonFill } from "@react-icons/all-files/bs/BsPersonFill";
import { FaAddressCard } from "@react-icons/all-files/fa/FaAddressCard";

import styles from "./ShySignInModal.module.scss";

const ShySignInModal: React.FC<ShySignInModalProps> = ({}) => {
  return (
    <div className={styles.wrapper}>
      <FaAddressCard />
    </div>
  );
};

export default ShySignInModal;

export interface ShySignInModalProps {}
