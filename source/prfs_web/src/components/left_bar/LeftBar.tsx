import React from "react";
import Link from "next/link";

import styles from "./LeftBar.module.scss";
import { i18nContext } from "@/contexts/i18n";

const Leftbar: React.FC<any> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <ul>
        <li>
          <Link href="/generate">{i18n.generate}</Link>
        </li>
        <li>{i18n.proofs}</li>
        <li>{i18n.references}</li>
        <li>
          <Link href="/sets">{i18n.sets}</Link>
        </li>
      </ul>
    </div>
  );
};

export default Leftbar;
