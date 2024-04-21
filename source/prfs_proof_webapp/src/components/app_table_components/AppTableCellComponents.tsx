import React from "react";
import cn from "classnames";

import styles from "./AppTableCellComponents.module.scss";

export const AppTableHeaderCell: React.FC<AppTableCellProps> = ({
  children,
  className,
  alwaysRender,
  w320,
  w480,
  w720,
  w1024,
  w1280,
  flexGrow,
}) => {
  return (
    <div
      className={cn(styles.tableHeaderCell, className, {
        [styles.alwaysRender]: alwaysRender,
        [styles.w320]: w320,
        [styles.w480]: w480,
        [styles.w720]: w720,
        [styles.w1024]: w1024,
        [styles.w1280]: w1280,
        [styles.flexGrow]: flexGrow,
      })}
    >
      {children}
    </div>
  );
};

export const AppTableCell: React.FC<AppTableCellProps> = ({
  children,
  className,
  alwaysRender,
  w320,
  w480,
  w720,
  w1024,
  w1280,
  flexGrow,
}) => {
  return (
    <div
      className={cn(styles.tableCell, className, {
        [styles.alwaysRender]: alwaysRender,
        [styles.w320]: w320,
        [styles.w480]: w480,
        [styles.w720]: w720,
        [styles.w1024]: w1024,
        [styles.w1280]: w1280,
        [styles.flexGrow]: flexGrow,
      })}
    >
      {children}
    </div>
  );
};

export const AppTableCellInner: React.FC<AppTableCellInnerProps> = ({ children, className }) => {
  return <div className={cn(styles.tableCellInner, className, {})}>{children}</div>;
};

export interface AppTableCellProps {
  children?: React.ReactNode;
  className?: string;
  alwaysRender?: boolean;
  w320?: boolean;
  w480?: boolean;
  w720?: boolean;
  w1024?: boolean;
  w1280?: boolean;
  flexGrow?: boolean;
}

export interface AppTableCellInnerProps {
  children?: React.ReactNode;
  className?: string;
}
