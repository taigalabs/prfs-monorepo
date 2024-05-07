import React from "react";
import cn from "classnames";

import styles from "./PostMarkdown.module.scss";

export const PostMarkdown: React.FC<PostInnerProps> = ({ className, html }) => {
  return (
    <div className={cn(styles.wrapper, className)} dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export interface PostInnerProps {
  className?: string;
  html: string;
}
