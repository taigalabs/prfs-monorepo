import React from "react";

import styles from "./ContentArea.module.scss";

export const ContentMain: React.FC<ContentAreaProps> = ({ children }) => {
  return <div className={styles.contentMain}>{children}</div>;
};

export const ContentLeft: React.FC<ContentAreaProps> = ({ children }) => {
  return <div className={styles.contentLeft}>{children}</div>;
};

export const ContentMainInfiniteScroll: React.FC<ContentMainInfiniteScrollProps> = ({
  children,
  onScroll,
  dRef,
  style,
}) => {
  return (
    <div
      className={styles.contentMainInfiniteScroll}
      {...{}}
      onScroll={onScroll}
      ref={dRef}
      style={style}
    >
      {children}
    </div>
  );
};

export const ContentMainCenter: React.FC<ContentAreaProps> = ({ children, style }) => {
  return (
    <div className={styles.contentMainCenter} style={style}>
      {children}
    </div>
  );
};

export const ContentMainHeader: React.FC<ContentMainHeaderProps> = ({ children, style }) => {
  return (
    <div className={styles.contentMainHeader} style={style}>
      {children}
    </div>
  );
};

export const ContentMainBody: React.FC<ContentMainBodyProps> = ({ style, children }) => {
  return (
    <div className={styles.contentMainBody} style={style}>
      {children}
    </div>
  );
};

export const ContentMainRight: React.FC<ContentMainHeaderProps> = ({ children }) => {
  return <div className={styles.contentMainRight}>{children}</div>;
};

export const ContentMainTitle: React.FC<ContentMainHeaderProps> = ({ children }) => {
  return <div className={styles.contentMainTitle}>{children}</div>;
};

export interface ContentAreaProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export interface ContentMainInfiniteScrollProps {
  children: React.ReactNode;
  onScroll?: React.UIEventHandler;
  dRef?: React.RefObject<HTMLDivElement>;
  style?: React.CSSProperties;
}

export interface ContentMainHeaderProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export interface ContentMainBodyProps {
  style?: React.CSSProperties;
  children: React.ReactNode;
}
