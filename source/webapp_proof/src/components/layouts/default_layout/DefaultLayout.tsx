import React from "react";
import cn from "classnames";

import styles from "./DefaultLayout.module.scss";

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export const DefaultBody: React.FC<DefaultBodyProps> = ({ children, noMinWidth }) => {
  return (
    <div
      className={cn(styles.body, {
        [styles.noMinWidth]: noMinWidth,
      })}
    >
      {children}
    </div>
  );
};

export const DefaultFooter: React.FC<DefaultLayoutProps> = ({ children }) => {
  return <div className={styles.footer}>{children}</div>;
};

export default DefaultLayout;

export interface DefaultLayoutProps {
  children: React.ReactNode;
}

export interface DefaultBodyProps {
  children: React.ReactNode;
  noMinWidth?: boolean;
}
