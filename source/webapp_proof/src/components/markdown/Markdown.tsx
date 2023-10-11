import React from "react";

import styles from "./Markdown.module.scss";

export const H1: React.FC<MarkdownComponentProps> = ({ children }) => {
  return <h1 className={styles.h1}>{children}</h1>;
};

export const H2: React.FC<MarkdownComponentProps> = ({ children }) => {
  return <h2 className={styles.h2}>{children}</h2>;
};

export const H3: React.FC<MarkdownComponentProps> = ({ children }) => {
  return <h3 className={styles.h3}>{children}</h3>;
};

export const P: React.FC<MarkdownComponentProps> = ({ children }) => {
  return <p className={styles.p}>{children}</p>;
};

export const Ul: React.FC<MarkdownComponentProps> = ({ children }) => {
  return <ul className={styles.ul}>{children}</ul>;
};

export const Li: React.FC<MarkdownComponentProps> = ({ children }) => {
  return <li className={styles.li}>{children}</li>;
};

export interface MarkdownComponentProps {
  children: React.ReactNode;
}
