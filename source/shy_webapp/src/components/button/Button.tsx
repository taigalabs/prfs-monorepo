import React from "react";
import cn from "classnames";

import styles from "./Button.module.scss";

const Button: React.FC<ButtonProps> = ({ children, variant, className }) => {
  return (
    <button
      className={cn(styles.wrapper, className, {
        [styles.green_1]: variant === "green_1",
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
  className?: string;
  variant: "green_1" | "white_1";
}
