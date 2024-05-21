import React from "react";
import cn from "classnames";

import styles from "./ContentMarkdown.module.scss";

const ContentMarkdown: React.FC<PostInnerProps> = ({ className, html }) => {
  return (
    <div className={cn(styles.wrapper, className)} dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export default ContentMarkdown;

export interface PostInnerProps {
  className?: string;
  html: string;
}
