import React from "react";
import cn from "classnames";

import styles from "./DefaultLayout.module.scss";

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export const DefaultBody: React.FC<DefaultBodyProps> = ({
  children,
  bigTopPadding,
  noTopPadding,
  noMinWidth,
}) => {
  return (
    <div
      className={cn(styles.body, {
        [styles.noMinWidth]: noMinWidth,
        [styles.bigTopPadding]: bigTopPadding,
        [styles.noTopPadding]: noTopPadding,
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
  bigTopPadding?: boolean;
  noTopPadding?: boolean;
  noMinWidth?: boolean;
}
