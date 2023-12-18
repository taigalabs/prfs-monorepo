import React from "react";
import cn from "classnames";

import styles from "./Modal.module.scss";

export const PrfsAppsPopoverUl: React.FC<PrfsAppsPopoverLiProps> = ({ children }) => {
  return <ul className={styles.appList}>{children}</ul>;
};

export const PrfsAppsPopoverLi: React.FC<PrfsAppsPopoverLiProps> = ({ children }) => {
  return <li className={styles.appItem}>{children}</li>;
};

const Modal: React.FC<ModalProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default Modal;

export interface ModalProps {
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
  children: React.ReactNode;
}

export interface PrfsAppsPopoverLiProps {
  children: React.ReactNode;
}
