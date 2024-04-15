"use client";

import React from "react";
import cn from "classnames";
import { GlobalMsgHeaderWrapper } from "@taigalabs/prfs-react-lib/src/global_msg_header/GlobalMsgHeaderComponents";
import {
  AlertBtnGroup,
  AlertContent,
  AlertWrapper,
} from "@taigalabs/prfs-react-lib/src/alert/AlertComponents";
import { IoMdWarning } from "@react-icons/all-files/io/IoMdWarning";
import { IoClose } from "@react-icons/all-files/io5/IoClose";

import styles from "./GlobalMsgHeader.module.scss";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { removeGlobalMsg } from "@/state/globalMsgReducer";

const GlobalMsgHeader: React.FC<GlobalErrorHeaderProps> = ({}) => {
  const msg = useAppSelector(state => state.globalMsg.msg);
  const dispatch = useAppDispatch();
  const handleClickClose = React.useCallback(() => {
    dispatch(removeGlobalMsg());
  }, [dispatch]);

  return (
    msg && (
      <GlobalMsgHeaderWrapper className={styles.wrapper}>
        <AlertWrapper variant={msg.variant}>
          <AlertContent>
            <p>{msg.message}</p>
          </AlertContent>
          <AlertBtnGroup>
            <button type="button" onClick={handleClickClose}>
              <IoClose />
            </button>
          </AlertBtnGroup>
        </AlertWrapper>
      </GlobalMsgHeaderWrapper>
    )
  );
};

export default GlobalMsgHeader;

export interface GlobalErrorHeaderProps {}
