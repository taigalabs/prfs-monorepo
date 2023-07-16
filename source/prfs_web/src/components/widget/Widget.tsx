import React from "react";
import Link from "next/link";
import Paper from "@mui/material/Paper";

import styles from "./Widget.module.scss";
import { I18nContext } from "@/contexts";

const Widget: React.FC<WidgetProps> = ({ className, children, label }) => {
  const i18n = React.useContext(I18nContext);

  return (
    <Paper className={`${styles.wrapper} ${className}`}>
      <div className={styles.upper}>{label}</div>
      <div className={styles.content}>{children}</div>
    </Paper>
  );
};

export default Widget;

export interface WidgetProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}
