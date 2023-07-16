import React from "react";
import Link from "next/link";

import styles from "./Table.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Logo from "@/components/logo/Logo";

const Table: React.FC<any> = () => {
  const i18n = React.useContext(i18nContext);

  return <div className={styles.wrapper}>table</div>;
};

export default Table;
