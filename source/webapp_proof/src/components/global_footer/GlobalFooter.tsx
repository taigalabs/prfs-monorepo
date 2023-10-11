"use client";

import React from "react";
import Link from "next/link";

import styles from "./GlobalFooter.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import LatestTimestamp from "@/components/latest_timestamp/LatestTimestamp";

const GlobalFooter: React.FC<GlobalFooterProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <ul className={styles.leftList}>
        <li>{i18n.english}</li>
        <li>
          <Link href={paths.updates}>
            <span>{i18n.updates} </span>
            <LatestTimestamp />
          </Link>
        </li>
      </ul>
      <ul className={styles.rightList}>
        <li>
          <Link href={process.env.NEXT_PUBLIC_CODE_REPOSITORY_URL}>{i18n.code}</Link>
        </li>
        <li>
          <Link href={paths.privacy}>{i18n.privacy}</Link>
        </li>
        <li>
          <Link href={process.env.NEXT_PUBLIC_TAIGALABS_ENDPOINT}>{i18n.taigalabs}</Link>
        </li>
      </ul>
    </div>
  );
};

export default GlobalFooter;

export interface GlobalFooterProps {}
