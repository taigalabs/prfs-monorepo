import React from "react";
import Link from "next/link";

import styles from "./LeftBar.module.scss";
import { i18nContext } from "@/contexts/i18n";

const Leftbar: React.FC<any> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <ul>
          <li className={styles.category}>{i18n.browse}</li>
          <li>{i18n.proofs}</li>
        </ul>
      </div>
      <div className={styles.section}>
        <ul>
          <li className={styles.category}>{i18n.generate}</li>
          <li>
            <Link href="/generate">{i18n.generate}</Link>
          </li>
          <li>
            <Link href="/circuits">{i18n.circuits}</Link>
          </li>
          <li>{i18n.proof_types}</li>
          <li>{i18n.references}</li>
          <li>
            <Link href="/sets">{i18n.sets}</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Leftbar;
