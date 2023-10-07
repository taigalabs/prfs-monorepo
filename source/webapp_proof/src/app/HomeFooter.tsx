"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import styles from "./HomeFooter.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const HomeFooter: React.FC<HomeFooterProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div></div>
      <div>
        <Link href={paths.privacy}>{i18n.privacy}</Link>
      </div>
    </div>
  );
};

export default HomeFooter;

export interface HomeFooterProps {}
