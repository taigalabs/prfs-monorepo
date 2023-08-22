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
        [styles.aqua_blue_1]: variant === "aqua_blue_1",
        [styles.transparent_a]: variant === "transparent_a",
        [styles.transparent_aqua_blue_1]: variant === "transparent_aqua_blue_1",
        [styles.transparent_aqua_blue_1_light]: variant === "transparent_aqua_blue_1_light",
        [styles.transparent_d]: variant === "transparent_d",
        [styles.text_c]: variant === "text_aqua_blue_1",
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
    | "transparent_a"
    | "b"
    | "aqua_blue_1"
    | "text_aqua_blue_1"
    | "transparent_aqua_blue_1"
    | "transparent_aqua_blue_1_light"
    | "transparent_d";
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  handleClick?: MouseEventHandler;
}
