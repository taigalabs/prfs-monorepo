import React, { MouseEventHandler } from "react";
import cn from "classnames";

import styles from "./HoverableText.module.scss";

const HoverableText: React.FC<ArrowButtonProps> = ({ className, children, disabled }) => {
  return (
    <p className={cn(styles.hoverableText, className, { [styles.disabled]: disabled })}>
      {children}
    </p>
  );
};

export default HoverableText;

export interface ArrowButtonProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}
