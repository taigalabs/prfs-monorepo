"use client";

import React from "react";
import Link from "next/link";

import styles from "./HomeFooter.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const HomeFooter: React.FC<HomeFooterProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div></div>
      <ul className={styles.rightList}>
        <li>
          <Link href={process.env.NEXT_PUBLIC_TAIGALABS_ENDPOINT}>{i18n.taigalabs}</Link>
        </li>
        <li>
          <Link href={paths.privacy}>{i18n.privacy}</Link>
        </li>
      </ul>
    </div>
  );
};

export default HomeFooter;

export interface HomeFooterProps {}
