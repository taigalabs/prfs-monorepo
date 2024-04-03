"use client";

import React from "react";
import cn from "classnames";
import { GlobalMsgHeaderWrapper } from "@taigalabs/prfs-react-lib/src/global_msg_header/GlobalMsgHeaderComponents";
import { IoClose } from "@react-icons/all-files/io5/IoClose";
import Overlay from "@taigalabs/prfs-react-lib/src/overlay/Overlay";
import {
  AlertBtnGroup,
  AlertContent,
  AlertWrapper,
} from "@taigalabs/prfs-react-lib/src/alert/AlertComponents";

import styles from "./GlobalErrorHeader.module.scss";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { removeGlobalError } from "@/state/globalErrorReducer";

const GlobalErrorHeader: React.FC<GlobalErrorDialogProps> = ({}) => {
  const error = useAppSelector(state => state.globalError.error);
  const dispatch = useAppDispatch();
  const handleClickClose = React.useCallback(() => {
    dispatch(removeGlobalError());
  }, [dispatch]);

  const notDismissible = error?.notDismissible;

  const elem = React.useMemo(() => {
    if (!error) {
      return null;
    }

    const content = (
      <GlobalMsgHeaderWrapper>
        <AlertWrapper variant="warn" className={styles.alert}>
          <AlertContent>
            <p>{error.message}</p>
          </AlertContent>
          <AlertBtnGroup>
            {!notDismissible && (
              <button type="button" onClick={handleClickClose}>
                <IoClose />
              </button>
            )}
          </AlertBtnGroup>
        </AlertWrapper>
      </GlobalMsgHeaderWrapper>
    );

    if (error.notOverlay) {
      return content;
    } else {
      return <Overlay className={styles.overlay}>{content}</Overlay>;
    }
  }, [error, handleClickClose]);

  return elem;
};

export default GlobalErrorHeader;

export interface GlobalErrorDialogProps {}
