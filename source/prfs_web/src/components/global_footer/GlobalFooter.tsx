"use client";

import React from "react";
import Link from "next/link";

import styles from "./GlobalFooter.module.scss";
import { i18nContext } from "@/contexts/i18n";

const GlobalFooter: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  const repoUrl = "https://github.com/taigalabs/prfs-monorepo";

  return (
    <div className={styles.wrapper}>
      <div className={styles.code}>
        <Link href={repoUrl}>{i18n.github}</Link>
      </div>
      <div className={styles.company}>{i18n.prfs_copyright}</div>
    </div>
  );
};

export default GlobalFooter;
