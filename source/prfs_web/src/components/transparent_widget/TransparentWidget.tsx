import React from "react";

import styles from "./TransparentWidget.module.scss";

export const TransparentWidgetHeader: React.FC<TransparentWidgetHeaderProps> = ({ children }) => {
  return <div className={styles.header}>{children}</div>;
};

const TransparentWidget: React.FC<TransparentWidgetProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default TransparentWidget;

export interface TransparentWidgetProps {
  children: React.ReactNode;
}

export interface TransparentWidgetHeaderProps {
  children: React.ReactNode;
}
