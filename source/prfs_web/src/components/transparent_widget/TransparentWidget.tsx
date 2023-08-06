import React from "react";
import Link from "next/link";

import styles from "./TransparentWidget.module.scss";

export const TransparentWidgetHeader: React.FC<TransparentWidgetHeaderProps> = ({ children }) => {
  return <div className={styles.header}>{children}</div>;
};

export const TransparentWidgetEntry: React.FC<TransparentWidgetEntryProps> = ({
  title,
  subtitle,
  createdAt,
  link,
}) => {
  return (
    <div className={styles.row}>
      <div className={styles.createdAt}>{createdAt}</div>
      <div className={styles.title}>
        <Link href={link}>{title}</Link>
      </div>
      <div className={styles.subtitle}>{subtitle}</div>
    </div>
  );
};

const TransparentWidget: React.FC<TransparentWidgetProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default TransparentWidget;

export interface TransparentWidgetProps {
  children: React.ReactNode;
}

export interface TransparentWidgetHeaderProps {
  children: React.ReactNode;
}

export interface TransparentWidgetEntryProps {
  title: string;
  subtitle: string;
  createdAt: string;
  link: string;
}

export interface TransparentWidgetData {
  title: string;
  subtitle: string;
  created_at: string;
  link: string;
}
