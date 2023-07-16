import React, { MouseEventHandler } from "react";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import classnames from "classnames";

import styles from "./Button.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget from "@/components/widget/Widget";

const Button1: React.FC<Button1Props> = ({ children, className, handleClick, variant }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <button
      className={classnames({
        [styles.a]: variant === "a",
        [styles.b]: variant === "b",
        [styles.transparent]: variant === "transparent_a",
        [className]: true
      })}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default Button1;

export interface Button1Props {
  variant: "a" | "b" | "transparent_a";
  className?: string;
  children: React.ReactNode;
  handleClick?: MouseEventHandler;
}
