import React from "react";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { FaAngleRight } from 'react-icons/fa6';

import styles from "./Breadcrumb.module.scss";

export const BreadcrumbEntry: React.FC<BreadcrumbEntryProps> = ({ children }) => {
  return (
    <div className={styles.breadcrumbEntryWrapper}>
      {children}
      <FaAngleRight />
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
