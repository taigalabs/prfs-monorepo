"use client";

import React from "react";
import cn from "classnames";
import {
  GlobalErrorDialogContent,
  GlobalErrorDialogWrapper,
  GlobalErrorDialogBtnGroup,
} from "@taigalabs/prfs-react-lib/src/global_error_dialog/GlobalErrorDialog";
import { IoMdWarning } from "@react-icons/all-files/io/IoMdWarning";
import { IoClose } from "@react-icons/all-files/io5/IoClose";
import Overlay from "@taigalabs/prfs-react-lib/src/overlay/Overlay";

import styles from "./GlobalErrorDialog.module.scss";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { removeError } from "@/state/errorReducer";

const GlobalErrorDialog: React.FC<GlobalErrorDialogProps> = ({}) => {
  const error = useAppSelector(state => state.error.error);
  const dispatch = useAppDispatch();
  const handleClickClose = React.useCallback(() => {
    dispatch(removeError());
  }, [dispatch]);

  return (
    error && (
      <Overlay className={styles.wrapper}>
        <GlobalErrorDialogWrapper>
          <GlobalErrorDialogContent>
            <IoMdWarning />
            <p>{error.message}</p>
          </GlobalErrorDialogContent>
          <GlobalErrorDialogBtnGroup>
            <button type="button" onClick={handleClickClose}>
              <IoClose />
            </button>
          </GlobalErrorDialogBtnGroup>
        </GlobalErrorDialogWrapper>
      </Overlay>
    )
  );
};

export default GlobalErrorDialog;

export interface GlobalErrorDialogProps {}
