import React, { ButtonHTMLAttributes, MouseEventHandler } from "react";
import cn from "classnames";

import styles from "./Button.module.scss";

function isTransparent(variant: Variant) {
  return (
    variant === "transparent_blue_1" ||
    variant === "transparent_blue_2" ||
    variant === "transparent_black_1" ||
    variant === "transparent_aqua_blue_1" ||
    variant === "transparent_aqua_blue_1_light"
  );
}

const Button: React.FC<ButtonProps> = ({
  children,
  type,
  className,
  handleClick,
  variant,
  disabled,
  name,
  noTransition,
  noShadow,
  smallPadding,
}) => {
  return (
    <button
      className={cn({
        [styles.wrapper]: true,
        [styles.transparent_btn]: isTransparent(variant),
        [styles.aqua_blue_1]: variant === "aqua_blue_1",
        [styles.blue_1]: variant === "blue_1",
        [styles.blue_2]: variant === "blue_2",
        [styles.transparent_blue_1]: variant === "transparent_blue_1",
        [styles.transparent_blue_2]: variant === "transparent_blue_2",
        [styles.transparent_black_1]: variant === "transparent_black_1",
        [styles.transparent_aqua_blue_1]: variant === "transparent_aqua_blue_1",
        [styles.transparent_aqua_blue_1_light]: variant === "transparent_aqua_blue_1_light",
        [styles.white_gray_1]: variant === "white_gray_1",
        [styles.white_black_1]: variant === "white_black_1",
        [styles.no_transition]: noTransition,
        [styles.no_shadow]: noShadow,
        [styles.smallPadding]: smallPadding,
        [className || ""]: !!className,
      })}
      {...(name && { name })}
      onClick={handleClick}
      disabled={!!disabled}
      type={type}
    >
      <div className={styles.backdrop} />
      {children}
    </button>
  );
};

export default Button;

export interface ButtonProps {
  variant: Variant;
  className?: string;
  name?: string;
  children: React.ReactNode;
  disabled?: boolean;
  handleClick?: MouseEventHandler;
  noTransition?: boolean;
  smallPadding?: boolean;
  noShadow?: boolean;
  type?: "submit" | "reset" | "button" | undefined;
}

export type Variant =
  | "aqua_blue_1"
  | "blue_1"
  | "blue_2"
  | "transparent_blue_1"
  | "transparent_blue_2"
  | "transparent_black_1"
  | "transparent_aqua_blue_1"
  | "transparent_aqua_blue_1_light"
  | "white_gray_1"
  | "white_black_1";
