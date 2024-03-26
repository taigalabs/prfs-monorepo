import React from "react";
import cn from "classnames";

import styles from "./PrfsIdSessionModal.module.scss";
import { i18nContext } from "../i18n/i18nContext";

const PrfsIdSessionModal: React.FC<ModalProps> = ({ setIsOpen }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <p className={styles.appId}>{i18n.id}</p>
      </div>
      <div className={styles.btnRow}>power</div>
    </div>
  );
};

export default PrfsIdSessionModal;

export interface ModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
}
