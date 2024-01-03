import React, { MouseEventHandler } from "react";
import cn from "classnames";

import styles from "./IconButton.module.scss";

const IconButton: React.FC<IconButtonProps> = ({
  className,
  handleClick,
  variant,
  disabled,
  children,
}) => {
  return (
    <button
      className={cn(styles.wrapper, {
        [styles.bright_gray_1]: variant === "bright_gray_1",
        [className!]: !!className,
      })}
      onClick={handleClick}
      disabled={!!disabled}
    >
      {children}
    </button>
  );
};

export default IconButton;

export interface IconButtonProps {
  variant: "bright_gray_1";
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  handleClick?: MouseEventHandler;
}
