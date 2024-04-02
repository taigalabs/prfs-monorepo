"use client";

import React from "react";
import Overlay from "@taigalabs/prfs-react-lib/src/overlay/Overlay";
import { GlobalMsgHeaderWrapper } from "@taigalabs/prfs-react-lib/src/global_msg_header/GlobalMsgHeaderComponents";
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
  const globalMsg = useAppSelector(state => state.globalMsg.msg);
  const dispatch = useAppDispatch();
  const handleClickClose = React.useCallback(() => {
    dispatch(removeGlobalMsg());
  }, [dispatch]);

  const notDismissible = globalMsg?.notDismissible;

  const elem = React.useMemo(() => {
    if (!globalMsg) {
      return null;
    }

    const content = (
      <GlobalMsgHeaderWrapper>
        <AlertWrapper variant="warn">
          <AlertContent>
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
      </GlobalMsgHeaderWrapper>
    );

    if (globalMsg.notOverlay) {
      return content;
    } else {
      return <Overlay className={styles.overlay}>{content}</Overlay>;
    }
  }, [globalMsg]);

  return elem;
};

export default GlobalMsgHeader;

export interface PrfsIdErrorDialogProps {}
