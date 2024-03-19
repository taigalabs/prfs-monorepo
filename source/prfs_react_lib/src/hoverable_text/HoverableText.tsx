import React, { MouseEventHandler } from "react";
import cn from "classnames";

import styles from "./HoverableText.module.scss";

const HoverableText: React.FC<ArrowButtonProps> = ({ className, children }) => {
  return <span className={cn(styles.hoverableText)}>{children}</span>;
};

export default HoverableText;

export interface ArrowButtonProps {
  className?: string;
  children?: React.ReactNode;
}
