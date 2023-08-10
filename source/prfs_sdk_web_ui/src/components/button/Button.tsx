import React, { MouseEventHandler } from "react";
import classnames from "classnames";

import styles from "./Button.module.scss";

const Button: React.FC<Button1Props> = ({ children, handleClick, variant, disabled }) => {
  return (
    <button
      className={classnames({
        [styles.a]: variant === "a",
        [styles.b]: variant === "b",
        [styles.transparent_a]: variant === "transparent_a",
      })}
      onClick={handleClick}
      disabled={!!disabled}
    >
      {children}
    </button>
  );
};

export default Button;

export interface Button1Props {
  variant: "a" | "b" | "transparent_a";
  children: React.ReactNode;
  handleClick?: MouseEventHandler;
  disabled?: boolean;
}
