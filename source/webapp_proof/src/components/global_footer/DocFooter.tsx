"use client";

import React from "react";
import Link from "next/link";

import styles from "./DocFooter.module.scss";
import { i18nContext } from "@/contexts/i18n";

const DocFooter: React.FC<DocFooterProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <ul className={styles.leftList}>
        <li>
          <a href={process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}>{i18n.prfs}</a>
        </li>
        <li>{i18n.english}</li>
      </ul>
      <ul className={styles.rightList}>
        <li>
          <Link href={process.env.NEXT_PUBLIC_TAIGALABS_ENDPOINT}>{i18n.taigalabs}</Link>
        </li>
      </ul>
    </div>
  );
};

export default DocFooter;

export interface DocFooterProps {}
