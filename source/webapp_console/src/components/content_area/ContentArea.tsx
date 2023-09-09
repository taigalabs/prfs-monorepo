import React from "react";

import styles from "./ContentArea.module.scss";

export const ContentAreaBody: React.FC<ContentAreaBodyProps> = ({ children }) => {
  return <div className={styles.body}>{children}</div>;
};

export const ContentAreaRow: React.FC<ContentAreaRowProps> = ({ children }) => {
  return <div className={styles.row}>{children}</div>;
};

export const ContentAreaHeader: React.FC<ContentAreaHeaderProps> = ({ children }) => {
  return (
    <>
      <div className={styles.floatingHeader}>
        <div className={styles.content}>{children}</div>
      </div>
      <div className={styles.placeholder} />
    </>
  );
};

export interface ContentAreaBodyProps {
  children: React.ReactNode;
}

export interface ContentAreaRowProps {
  children?: React.ReactNode;
}

export interface ContentAreaHeaderProps {
  children: React.ReactNode;
}
