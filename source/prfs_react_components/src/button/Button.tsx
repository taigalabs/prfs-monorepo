import React, { MouseEventHandler } from "react";
import classnames from "classnames";

import styles from "./Button.module.scss";

const Button: React.FC<ButtonProps> = ({ children, className, handleClick, variant, disabled }) => {
  return (
    <button
      className={classnames({
        [styles.wrapper]: true,
        [styles.a]: variant === "a",
        [styles.b]: variant === "b",
        [styles.c]: variant === "c",
        [styles.transparent_a]: variant === "transparent_a",
        [styles.transparent_c]: variant === "transparent_c",
        [styles.transparent_c_light]: variant === "transparent_c_light",
        [styles.transparent_d]: variant === "transparent_d",
        [styles.text_c]: variant === "text_c",
        [className || ""]: true,
      })}
      onClick={handleClick}
      disabled={!!disabled}
    >
      {children}
    </button>
  );
};

export default Button;

export interface ButtonProps {
  variant:
    | "a"
    | "b"
    | "c"
    | "transparent_a"
    | "text_c"
    | "transparent_c"
    | "transparent_c_light"
    | "transparent_d";
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  handleClick?: MouseEventHandler;
}
