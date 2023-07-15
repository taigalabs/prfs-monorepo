import React from "react";
import Link from "next/link";

import styles from "./Table.module.scss";
import { I18nContext } from "@/contexts";
import Logo from "@/components/logo/Logo";

const Table: React.FC<any> = () => {
  const i18n = React.useContext(I18nContext);

  return <div className={styles.wrapper}>table</div>;
};

export default Table;
