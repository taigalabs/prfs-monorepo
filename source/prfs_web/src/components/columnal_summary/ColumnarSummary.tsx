"use client";

import React from "react";

import styles from "./ColumnarSummary.module.scss";

export const PaddedSummaryWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className={styles.paddedSummaryWrapper}>{children}</div>;
};

const ColumnarSummary: React.FC<ColumnarSummaryProps> = ({ children }) => {
  return <div className={styles.columnarSummaryWrapper}>{children}</div>;
};

export const ColumnarSummaryColumn: React.FC<ColumnarSummaryColumnProps> = ({ children }) => {
  return <div className={styles.columnarSummaryCol}>{children}</div>;
};

export const ColumnarSummaryCell: React.FC<ColumnarSummaryCellProps> = ({ children }) => {
  return <div className={styles.columnarSummaryCell}>{children}</div>;
};

export const ColumnarSummaryCellHeader: React.FC<ColumnarSummaryCellProps> = ({ children }) => {
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
