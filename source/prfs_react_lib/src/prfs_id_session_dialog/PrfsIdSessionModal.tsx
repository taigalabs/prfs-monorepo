import React from "react";
import cn from "classnames";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";

import styles from "./PrfsIdSessionModal.module.scss";
import { i18nContext } from "../i18n/i18nContext";
import Button from "../button/Button";

const PrfsIdSessionModal: React.FC<ModalProps> = ({ actionLabel, setIsOpen, sessionKey }) => {
  const i18n = React.useContext(i18nContext);
  const handleClickClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const sessionKeyAbbrev = React.useMemo(() => {
    return abbrev7and5(sessionKey);
  }, [sessionKey]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <p className={styles.msg}>
          <span>{i18n.you_requested_to}</span>
          <span className={styles.actionLabel}>{actionLabel}</span>
        </p>
        <p className={styles.sessionKey}>
          <span>{i18n.session_key}</span>
          <span className={styles.actionLabel}>{sessionKeyAbbrev}</span>
        </p>
        <p className={styles.guide}>{i18n.prfs_id_session_modal_guide}</p>
        <div>
          <Button variant="blue_3" className={styles.submitBtn} rounded>
            {i18n.submit}
          </Button>
        </div>
      </div>
      <div className={styles.btnRow}>
        <Button variant="transparent_black_1" handleClick={handleClickClose}>
          {i18n.abort}
        </Button>
      </div>
    </div>
  );
};

export default PrfsIdSessionModal;

export interface ModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
  actionLabel: string;
  sessionKey: string;
}
