import React from "react";
import Link from "next/link";

import styles from "./LeftBar.module.scss";
import { i18nContext } from "@/contexts/i18n";
import ActiveLink from "@/components/active_link/ActiveLink";

const Leftbar: React.FC<any> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <ul>
        <li>
          <ActiveLink href="/" exact>
            {i18n.home}
          </ActiveLink>
        </li>
      </ul>
      <div className={styles.section}>
        <ul>
          <li className={styles.category}>{i18n.proofs}</li>
          <li>
            <ActiveLink href="/proofs">{i18n.proof_instances}</ActiveLink>
          </li>
          <li>
            <ActiveLink href="/proof_types">{i18n.proof_types}</ActiveLink>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <ul>
          <li className={styles.category}>{i18n.circuits}</li>
          <li>
            <ActiveLink href="/circuits">{i18n.circuits}</ActiveLink>
          </li>
          <li>
            <ActiveLink href="/drivers">{i18n.circuit_drivers}</ActiveLink>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <ul>
          <li className={styles.category}>{i18n.references}</li>
          <li>
            <ActiveLink href="/sets">{i18n.sets}</ActiveLink>
          </li>
          <li>{i18n.dynamic_sets}</li>
        </ul>
      </div>
    </div>
  );
};

export default Leftbar;
