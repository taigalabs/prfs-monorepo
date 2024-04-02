"use client";

import React from "react";
import Overlay from "@taigalabs/prfs-react-lib/src/overlay/Overlay";
import GlobalMsgHeader_ from "@taigalabs/prfs-react-lib/src/global_msg_header/GlobalMsgHeader";
import {
  AlertWrapper,
  AlertContent,
  AlertBtnGroup,
} from "@taigalabs/prfs-react-lib/src/alert/AlertComponents";
import { IoClose } from "@react-icons/all-files/io5/IoClose";

import styles from "./GlobalMsgHeader.module.scss";
import { useI18N } from "@/i18n/context";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { removeGlobalMsg } from "@/state/globalMsgReducer";

const GlobalMsgHeader: React.FC<PrfsIdErrorDialogProps> = ({}) => {
  const i18n = useI18N();
  // const [isOpen, setIsOpen] = React.useState(true);
  const globalMsg = useAppSelector(state => state.globalMsg.msg);
  const dispatch = useAppDispatch();
  const handleClickClose = React.useCallback(() => {
    dispatch(removeGlobalMsg());
  }, [dispatch]);

  const notDismissible = globalMsg?.notDismissible;

  return (
    globalMsg && (
      <Overlay className={styles.overlay}>
        <GlobalMsgHeader_>
          <AlertWrapper variant="warn">
            <AlertContent>
              {/* <IoWarningOutline /> */}
              <p>{globalMsg.message}</p>
            </AlertContent>
            <AlertBtnGroup>
              {!notDismissible && (
                <button type="button" onClick={handleClickClose}>
                  <IoClose />
                </button>
              )}
            </AlertBtnGroup>
          </AlertWrapper>
        </GlobalMsgHeader_>
      </Overlay>
    )
  );
};

export default GlobalMsgHeader;

export interface PrfsIdErrorDialogProps {}
