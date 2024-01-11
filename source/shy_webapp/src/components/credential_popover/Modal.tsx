import React from "react";
import cn from "classnames";

import styles from "./Modal.module.scss";
import { useI18N } from "@/i18n/context";
import MyAvatar from "../my_avatar/MyAvatar";
import { LocalShyCredential } from "@/storage/local_storage";

const Modal: React.FC<ModalProps> = ({ handleClickSignOut, credential }) => {
  const i18n = useI18N();

  return (
    <div className={styles.modal}>
      <div className={styles.avatar}>
        <MyAvatar credential={credential} size={60} />
      </div>
      <div className={styles.meta}>
        <p className={styles.appId}>{i18n.id}</p>
        <p className={styles.id}>{credential.account_id}</p>
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
  credential: LocalShyCredential;
}
