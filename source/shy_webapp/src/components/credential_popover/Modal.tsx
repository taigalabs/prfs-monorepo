import React from "react";
import { usePrfsI18N } from "@taigalabs/prfs-i18n/react";
import cn from "classnames";

import styles from "./Modal.module.scss";
import MyAvatar from "@/components/my_avatar/MyAvatar";
import { LocalShyCredential } from "@/storage/local_storage";

const Modal: React.FC<ModalProps> = ({ handleClickSignOut, credential }) => {
  const i18n = usePrfsI18N();

  return (
    <div className={styles.modal}>
      <div className={styles.avatarSection}>
        <MyAvatar credential={credential} size={60} className={styles.avatar} />
      </div>
      <div className={styles.meta}>
        <div className={styles.section}>
          <p className={styles.label}>{i18n.id}</p>
          <p className={styles.value}>{credential.account_id}</p>
        </div>
        <div className={styles.section}>
          <p className={styles.label}>{i18n.public_key}</p>
          <p className={styles.value}>{credential.public_key}</p>
        </div>
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
