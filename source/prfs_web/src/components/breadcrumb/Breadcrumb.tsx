import React, { MouseEventHandler } from "react";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import classnames from "classnames";

import styles from "./Breadcrumb.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Widget from "@/components/widget/Widget";

const Breadcrumb: React.FC<Button1Props> = ({ children }) => {
  const i18n = React.useContext(i18nContext);

  return <div className={styles.wrapper}>{children}</div>;
};

export default Breadcrumb;

export interface Button1Props {
  children: React.ReactNode;
}
