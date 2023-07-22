import React from "react";
import Link from "next/link";

import styles from "./LeftBar.module.scss";
import { i18nContext } from "@/contexts/i18n";
import ActiveLink from "@/components/active_link/ActiveLink";

const Leftbar: React.FC<any> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <ul>
          <li className={styles.category}>{i18n.browse}</li>
          <li>
            <ActiveLink href="/proofs">{i18n.proofs}</ActiveLink>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <ul>
          <li className={styles.category}>{i18n.generate}</li>
          <li>
            <ActiveLink href="/generate">{i18n.generate}</ActiveLink>
          </li>
          <li>
            <ActiveLink href="/circuits">{i18n.circuits}</ActiveLink>
          </li>
          <li>{i18n.proof_types}</li>
        </ul>
      </div>
      <div className={styles.section}>
        <ul>
          <li className={styles.category}>{i18n.references}</li>
          <li>
            <ActiveLink href="/sets">{i18n.sets}</ActiveLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Leftbar;
