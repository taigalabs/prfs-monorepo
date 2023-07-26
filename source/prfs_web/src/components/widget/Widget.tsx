import React from "react";
import Link from "next/link";
import Paper from "@mui/material/Paper";

import styles from "./Widget.module.scss";
import { i18nContext } from "@/contexts/i18n";

const Widget: React.FC<WidgetProps> = ({ className, children, label, headerElem }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <Paper className={`${styles.wrapper} ${className}`}>
      {headerElem ? headerElem : <div className={styles.header}>{label}</div>}
      <div className={styles.body}>{children}</div>
    </Paper>
  );
};

export default Widget;

export interface WidgetProps {
  label: string;
  children: React.ReactNode;
  headerElem?: React.ReactNode;
  className?: string;
}
