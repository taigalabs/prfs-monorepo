"use client";

import React from "react";
import cn from "classnames";

import styles from "./GlobalErrorDialog.module.scss";
import { useAppSelector } from "@/state/hooks";
import Overlay from "@taigalabs/prfs-react-lib/src/overlay/Overlay";

const GlobalErrorDialog: React.FC<GlobalErrorDialogProps> = ({}) => {
  const error = useAppSelector(state => state.error.error);
  console.log(11, error);

  return (
    error && (
      <Overlay className={styles.wrapper}>
        <div className={styles.dialog}>333</div>
      </Overlay>
    )
  );
};

export default GlobalErrorDialog;

export interface GlobalErrorDialogProps {}
