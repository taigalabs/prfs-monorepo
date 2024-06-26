import React from "react";

import styles from "./Widget.module.scss";

export const TopWidgetTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={styles.topWidgetTitle}>{children}</div>;
};

export const WidgetLabel: React.FC<WidgetLabelProps> = ({ children }) => {
  return <div className={styles.widgetLabelWrapper}>{children}</div>;
};

export const WidgetPaddedBody: React.FC<WidgetPaddedBodyProps> = ({ children }) => {
  return <div className={styles.widgetPaddedBodyWrapper}>{children}</div>;
};

export const WidgetHeader: React.FC<WidgetHeaderProps> = ({ children }) => {
  return <div className={styles.widgetHeaderWrapper}>{children}</div>;
};

const Widget: React.FC<WidgetProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default Widget;

export interface WidgetProps {
  children: React.ReactNode;
}

export interface WidgetHeaderProps {
  children: React.ReactNode;
}

export interface WidgetLabelProps {
  children: React.ReactNode;
}

export interface WidgetPaddedBodyProps {
  children: React.ReactNode;
}
