import React from "react";
import Link from "next/link";

import styles from "./Widget.module.scss";
import { I18nContext } from "@/contexts";

const Widget: React.FC<WidgetProps> = ({ children, label }) => {
  const i18n = React.useContext(I18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>{label}</div>
      <div>{children}</div>
    </div>
  );
};

export default Widget;

export interface WidgetProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}
