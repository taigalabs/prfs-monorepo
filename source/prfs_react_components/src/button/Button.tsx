import React, { MouseEventHandler } from "react";
import classnames from "classnames";

import styles from "./Button.module.scss";

const Button: React.FC<Button1Props> = ({
  children,
  className,
  handleClick,
  variant,
  disabled,
}) => {
  return (
    <button
      className={classnames({
        [styles.a]: variant === "a",
        [styles.b]: variant === "b",
        [styles.c]: variant === "c",
        [styles.transparent_a]: variant === "transparent_a",
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

export interface Button1Props {
  variant: "a" | "b" | "c" | "transparent_a";
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  handleClick?: MouseEventHandler;
}
