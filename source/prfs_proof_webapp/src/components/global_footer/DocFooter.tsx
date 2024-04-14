import React from "react";
import Link from "next/link";

import styles from "./DocFooter.module.scss";
import { getI18N } from "@/i18n/get_i18n";
import { envs } from "@/envs";

const DocFooter: React.FC<DocFooterProps> = async () => {
  const i18n = await getI18N();

  return (
    <div className={styles.wrapper}>
      <ul className={styles.leftList}>
        <li>
          <a href={envs.NEXT_PUBLIC_PRFS_PROOF_WEBAPP_ENDPOINT}>{i18n.prfs}</a>
        </li>
        <li>{i18n.english}</li>
      </ul>
      <ul className={styles.rightList}>
        <li>
          <Link href={envs.NEXT_PUBLIC_TAIGALABS_ENDPOINT}>{i18n.taigalabs}</Link>
        </li>
      </ul>
    </div>
  );
};

export default DocFooter;

export interface DocFooterProps {}
