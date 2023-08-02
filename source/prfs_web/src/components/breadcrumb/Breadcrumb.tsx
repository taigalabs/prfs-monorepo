import React from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import styles from "./Breadcrumb.module.scss";

export const BreadcrumbEntry: React.FC<BreadcrumbEntryProps> = ({ children }) => {
  return (
    <div className={styles.breadcrumbEntryWrapper}>
      {children}
      <ArrowForwardIosIcon />
    </div>
  );
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ children }) => {
  return <div className={styles.breadcrumbWrapper}>{children}</div>;
};

export default Breadcrumb;

export interface BreadcrumbProps {
  children: React.ReactNode;
}

export interface BreadcrumbEntryProps {
  children: React.ReactNode;
}
