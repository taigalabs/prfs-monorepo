import React from "react";
import cn from "classnames";
import { abbrev7and5 } from "@taigalabs/prfs-ts-utils";
import { IoCloseSharp } from "@react-icons/all-files/io5/IoCloseSharp";
import { useMutation } from "@tanstack/react-query";
import { idSessionApi } from "@taigalabs/prfs-api-js";
import { GetPrfsIdSessionValueRequest } from "@taigalabs/prfs-entities/bindings/GetPrfsIdSessionValueRequest";
import { FaLock } from "@react-icons/all-files/fa/FaLock";

import styles from "./PrfsIdSessionModal.module.scss";
import { i18nContext } from "../i18n/i18nContext";
import Button from "../button/Button";
import { ErrorBox } from "../error_box/ErrorBox";

const PrfsIdSessionModal: React.FC<ModalProps> = ({
  actionLabel,
  setIsOpen,
  sessionKey,
  handleSucceed,
}) => {
  const i18n = React.useContext(i18nContext);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const { mutateAsync: getPrfsIdSessionValue } = useMutation({
    mutationFn: (req: GetPrfsIdSessionValueRequest) => {
      return idSessionApi({ type: "get_prfs_id_session_value", ...req });
    },
  });

  const handleClickClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const sessionKeyAbbrev = React.useMemo(() => {
    return abbrev7and5(sessionKey);
  }, [sessionKey]);

  const handleClickSubmit = React.useCallback(async () => {
    setErrorMsg(null);
    const { payload, error } = await getPrfsIdSessionValue({ key: sessionKey });

    if (error) {
      setErrorMsg(error.toString());
      return;
    }

    if (!payload?.session?.value || payload?.session?.value.length < 1) {
      setErrorMsg(
        "Cannot find the value submitted. Did you submit the data in the \
        Prfs ID popup?",
      );
      return;
    }

    handleSucceed(payload.session.value);
  }, [getPrfsIdSessionValue, setErrorMsg, handleSucceed]);

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
          <Button
            variant="blue_3"
            className={styles.submitBtn}
            rounded
            handleClick={handleClickSubmit}
          >
            <p className={styles.btnContent}>
              <span className={styles.lock}>
                <FaLock />
              </span>
              <span>{i18n.submit}</span>
            </p>
          </Button>
        </div>
        {errorMsg && (
          <div className={styles.errorMsg}>
            <ErrorBox>{errorMsg}</ErrorBox>
          </div>
        )}
      </div>
      <div className={styles.btnRow}>
        <Button variant="transparent_black_1" handleClick={handleClickClose}>
          <p className={cn(styles.btnContent, styles.abortBtn)}>
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
  handleSucceed: (sessionValue: number[]) => void;
}
