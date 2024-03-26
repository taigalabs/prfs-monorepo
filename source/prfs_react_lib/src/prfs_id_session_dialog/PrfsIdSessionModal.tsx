import React from "react";
import cn from "classnames";

import styles from "./PrfsIdSessionModal.module.scss";
import { i18nContext } from "../i18n/i18nContext";
import Button from "../button/Button";

const PrfsIdSessionModal: React.FC<ModalProps> = ({ actionLabel, setIsOpen }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <p className={styles.msg}>
          <span>{i18n.you_requested_to}</span>
          <span className={styles.actionLabel}>{actionLabel}</span>
        </p>
        <p className={styles.guide}></p>
        <div>
          <Button variant="blue_3">{i18n.submit}</Button>
        </div>
      </div>
      <div className={styles.btnRow}>
        <Button variant="transparent_black_1">{i18n.abort}</Button>
      </div>
    </div>
  );
};

export default PrfsIdSessionModal;

export interface ModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
  actionLabel: string;
}
