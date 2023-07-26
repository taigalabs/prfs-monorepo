"use client";

import React from "react";

import styles from "./ColumnarSummary.module.scss";

const ColumnarSummary: React.FC<ColumnarSummaryProps> = ({ children }) => {
  return <div className={styles.columnarSummaryWrapper}>{children}</div>;
};

const ColumnarSummaryColumn: React.FC<ColumnarSummaryColumnProps> = ({ children }) => {
  return <div className={styles.columnarSummaryCol}>{children}</div>;
};

const ColumnarSummaryCell: React.FC<ColumnarSummaryCellProps> = ({ children }) => {
  return <div className={styles.columnarSummaryCell}>{children}</div>;
};

const ColumnarSummaryCellHeader: React.FC<ColumnarSummaryCellProps> = ({ children }) => {
  return <div className={styles.columnarSummaryCellHeader}>{children}</div>;
};

export interface ColumnarSummaryProps {
  children: React.ReactNode;
}

export interface ColumnarSummaryColumnProps {
  children: React.ReactNode;
}

export interface ColumnarSummaryCellProps {
  children: React.ReactNode;
}

export default ColumnarSummary;

export { ColumnarSummaryColumn, ColumnarSummaryCell, ColumnarSummaryCellHeader };
