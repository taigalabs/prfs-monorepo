"use client";

import React from "react";
import cn from "classnames";
import { GlobalMsgHeaderWrapper } from "@taigalabs/prfs-react-lib/src/global_msg_header/GlobalMsgHeaderComponents";
import { IoClose } from "@react-icons/all-files/io5/IoClose";
import Overlay from "@taigalabs/prfs-react-lib/src/overlay/Overlay";
import {
  AlertWrapper,
  AlertBtnGroup,
  AlertContent,
} from "@taigalabs/prfs-react-lib/src/alert/AlertComponents";

import styles from "./GlobalErrorDialog.module.scss";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { removeGlobalMsg } from "@/state/globalMsgReducer";

const GlobalErrorDialog: React.FC<GlobalErrorDialogProps> = ({}) => {
  const error = useAppSelector(state => state.globalMsg.msg);
  const dispatch = useAppDispatch();
  const handleClickClose = React.useCallback(() => {
    dispatch(removeGlobalMsg());
  }, [dispatch]);

  return (
    error && (
      <Overlay className={styles.wrapper} fixed>
        <GlobalMsgHeaderWrapper>
          <AlertWrapper variant="error">
            <AlertContent>
              <p>{error.message}</p>
            </AlertContent>
            <AlertBtnGroup>
              <button type="button" onClick={handleClickClose}>
                <IoClose />
              </button>
            </AlertBtnGroup>
          </AlertWrapper>
        </GlobalMsgHeaderWrapper>
      </Overlay>
    )
  );
};

export default GlobalErrorDialog;

export interface GlobalErrorDialogProps {}
