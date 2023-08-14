"use client";

import React from "react";
import Link from "next/link";

import styles from "./ProjectMeta.module.scss";
import { i18nContext } from "@/contexts/i18n";

const ProjectMeta: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  const repoUrl = "https://github.com/taigalabs/prfs-monorepo";

  return (
    <div className={styles.wrapper}>
      <ul className={styles.nav}>
        <li className={styles.inactive}>{i18n.language}</li>
        <li>
          <Link href="https://github.com/taigalabs/prfs-monorepo/discussions/categories/general">
            {i18n.feedback}
          </Link>
        </li>
        <li className={styles.code}>
          <Link href={repoUrl}>{i18n.github}</Link>
        </li>
        <li className={styles.inactive}>{i18n.terms}</li>
        <li className={styles.inactive}>{i18n.privacy}</li>
      </ul>
      <div className={styles.company}>{i18n.prfs_copyright}</div>
    </div>
  );
};

export default ProjectMeta;
