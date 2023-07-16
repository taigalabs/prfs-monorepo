import React, { MouseEventHandler } from "react";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import classnames from "classnames";

import styles from "./Button2.module.scss";
import { I18nContext } from "@/contexts";
import Widget from "@/components/widget/Widget";

const Button2: React.FC<Button1Props> = ({ children, className, handleClick }) => {
  const i18n = React.useContext(I18nContext);

  return (
    <button className={classnames(styles.wrapper, className)} onClick={handleClick}>
      {children}
    </button>
  );
};

export default Button2;

export interface Button1Props {
  className?: string;
  children: React.ReactNode;
  handleClick: MouseEventHandler;
}
