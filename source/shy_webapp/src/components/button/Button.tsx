import React from "react";
import cn from "classnames";

import styles from "./Button.module.scss";

const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  className,
  isActive,
  handleClick,
  disabled,
}) => {
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(styles.wrapper, className, {
        [styles.isActive]: isActive,
        [styles.green_1]: variant === "green_1",
        [styles.transparent_1]: variant === "transparent_1",
        [styles.white_1]: variant === "white_1",
      })}
      type="button"
    >
      {children}
    </button>
  );
};

export default Button;

export interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant: "green_1" | "white_1" | "transparent_1";
  isActive?: boolean;
  handleClick?: (e: React.MouseEvent) => void;
}
