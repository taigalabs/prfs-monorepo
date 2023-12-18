import React from "react";
import cn from "classnames";

import styles from "./Modal.module.scss";
import { i18nContext } from "../i18n/i18nContext";

const Modal: React.FC<ModalProps> = ({ id, handleClickSignOut }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.modal}>
      <div className={styles.main}>
        <p className={styles.appId}>prfs_proof</p>
        <p className={styles.id}>{id}</p>
      </div>
      <div className={styles.btnRow}>
        <button className={styles.signOutBtn} onClick={handleClickSignOut}>
          {i18n.sign_out}
        </button>
      </div>
    </div>
  );
};

export default Modal;

export interface ModalProps {
  handleClickSignOut: () => void;
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
  id: string;
}
