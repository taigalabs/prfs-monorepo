import React from "react";
import cn from "classnames";

import styles from "./PrfsAppsModal.module.scss";

export const PrfsAppsPopoverUl: React.FC<PrfsAppsPopoverLiProps> = ({ children }) => {
  return <ul className={styles.appList}>{children}</ul>;
};

export const PrfsAppsPopoverLi: React.FC<PrfsAppsPopoverLiProps> = ({ children, noPadding }) => {
  return <li className={cn(styles.appItem, { [styles.noPadding]: noPadding })}>{children}</li>;
};

const PrfsAppsModal: React.FC<ModalProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default PrfsAppsModal;

export interface ModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
  children: React.ReactNode;
}

export interface PrfsAppsPopoverLiProps {
  children: React.ReactNode;
  noPadding?: boolean;
}
