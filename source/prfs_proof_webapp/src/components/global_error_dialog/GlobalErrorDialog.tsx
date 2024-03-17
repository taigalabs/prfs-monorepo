"use client";

import React from "react";
import cn from "classnames";
import {
  GlobalMsgHeaderContent,
  GlobalMsgHeaderWrapper,
  GlobalMsgHeaderBtnGroup,
} from "@taigalabs/prfs-react-lib/src/global_msg_header/GlobalMsgHeader";
import { IoMdWarning } from "@react-icons/all-files/io/IoMdWarning";
import { IoClose } from "@react-icons/all-files/io5/IoClose";
import Overlay from "@taigalabs/prfs-react-lib/src/overlay/Overlay";

import styles from "./GlobalErrorDialog.module.scss";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { removeGlobalError } from "@taigalabs/prfs-react-lib/src/global_error_reducer";

const GlobalErrorDialog: React.FC<GlobalErrorDialogProps> = ({}) => {
  const error = useAppSelector(state => state.globalError.error);
  const dispatch = useAppDispatch();
  const handleClickClose = React.useCallback(() => {
    dispatch(removeGlobalError());
  }, [dispatch]);

  return (
    error && (
      <Overlay className={styles.wrapper}>
        <GlobalMsgHeaderWrapper variant="error">
          <GlobalMsgHeaderContent>
            <IoMdWarning />
            <p>{error.message}</p>
          </GlobalMsgHeaderContent>
          <GlobalMsgHeaderBtnGroup>
            <button type="button" onClick={handleClickClose}>
              <IoClose />
            </button>
          </GlobalMsgHeaderBtnGroup>
        </GlobalMsgHeaderWrapper>
      </Overlay>
    )
  );
};

export default GlobalErrorDialog;

export interface GlobalErrorDialogProps {}
