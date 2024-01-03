import React from "react";
import Link from "next/link";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";

import styles from "./MarkdownWrapper.module.scss";
import { i18nContext } from "@/i18n/context";

const MarkdownWrapper: React.FC<MarkdownWrapperProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default MarkdownWrapper;

export interface MarkdownWrapperProps {
  children: React.ReactNode;
}
