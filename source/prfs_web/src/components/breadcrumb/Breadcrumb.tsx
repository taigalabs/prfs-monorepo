import React from "react";
import Link from "next/link";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import styles from "./Breadcrumb.module.scss";
import { i18nContext } from "@/contexts/i18n";

export const BreadcrumbEntry: React.FC<BreadcrumbEntryProps> = ({ children }) => {
  return (
    <div className={styles.breadcrumbEntryWrapper}>
      {children}
      <ArrowForwardIosIcon />
    </div>
  );
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ children }) => {
  const i18n = React.useContext(i18nContext);

  return <div className={styles.breadcrumbWrapper}>{children}</div>;
};

export default Breadcrumb;

export interface BreadcrumbProps {
  children: React.ReactNode;
}

export interface BreadcrumbEntryProps {
  children: React.ReactNode;
}
