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
import { removeGlobalMsg } from "@/state/globalMsgReducer";

const GlobalErrorHeader: React.FC<GlobalErrorDialogProps> = ({}) => {
  const msg = useAppSelector(state => state.globalError.msg);
  const dispatch = useAppDispatch();
  const handleClickClose = React.useCallback(() => {
    dispatch(removeGlobalMsg());
  }, [dispatch]);

  const notDismissible = msg?.notDismissible;

  const elem = React.useMemo(() => {
    if (!msg) {
      return null;
    }

    const content = (
      <GlobalMsgHeaderWrapper>
        <AlertWrapper variant="warn" className={styles.alert}>
          <AlertContent>
            <p>{msg.message}</p>
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

    if (msg.notOverlay) {
      return content;
    } else {
      return <Overlay className={styles.overlay}>{content}</Overlay>;
    }
  }, [msg, handleClickClose]);

  return elem;
};

export default GlobalErrorHeader;

export interface GlobalErrorDialogProps {}
