import React from "react";
import cn from "classnames";

import styles from "./Markdown.module.scss";

export const Markdown: React.FC<MarkdownComponentProps> = ({ children, className }) => {
  return <div className={cn(styles.markdown, className)}>{children}</div>;
};

export interface MarkdownComponentProps {
  children: React.ReactNode;
  className?: string;
}
