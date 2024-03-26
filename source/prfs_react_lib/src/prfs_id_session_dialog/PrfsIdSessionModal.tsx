import React from "react";
import cn from "classnames";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import { IoCloseSharp } from "@react-icons/all-files/io5/IoCloseSharp";
import { FaLock } from "@react-icons/all-files/fa/FaLock";

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
        <p className={styles.guide}>
          Proceed and create data in the <b>Prfs ID</b> popup. Click submit below once you are done.
          If you did not see the popup, check your settings and try again
        </p>
        <div className={styles.btnContainer}>
          <Button variant="blue_3" className={styles.submitBtn} rounded>
            <p className={styles.btnContent}>
              <span className={styles.lock}>
                <FaLock />
              </span>
              <span>{i18n.submit}</span>
            </p>
          </Button>
        </div>
      </div>
      <div className={styles.btnRow}>
        <Button variant="transparent_black_1" handleClick={handleClickClose}>
          <p className={styles.btnContent}>
            <IoCloseSharp />
            <span>{i18n.abort}</span>
          </p>
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
