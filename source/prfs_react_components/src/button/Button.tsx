import React, { MouseEventHandler } from "react";
import classnames from "classnames";

import styles from "./Button.module.scss";

const Button: React.FC<ButtonProps> = ({ children, className, handleClick, variant, disabled }) => {
  return (
    <button
      className={classnames({
        [styles.wrapper]: true,
        [styles.aqua_blue_1]: variant === "aqua_blue_1",
        [styles.white_1]: variant === "white_1",
        [styles.transparent_aqua_blue_1]: variant === "transparent_aqua_blue_1",
        [styles.transparent_aqua_blue_1_light]: variant === "transparent_aqua_blue_1_light",
        [styles.text_aqua_blue_1]: variant === "text_aqua_blue_1",
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
    | "aqua_blue_1"
    | "white_1"
    | "text_aqua_blue_1"
    | "transparent_aqua_blue_1"
    | "transparent_aqua_blue_1_light";
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  handleClick?: MouseEventHandler;
}
