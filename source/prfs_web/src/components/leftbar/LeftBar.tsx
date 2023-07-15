import React from "react";
import Link from "next/link";

import styles from "./LeftBar.module.scss";
import { I18nContext } from "@/contexts";

const Leftbar: React.FC<any> = () => {
  const i18n = React.useContext(I18nContext);

  return (
    <div className={styles.wrapper}>
      <ul>
        <li>{i18n.generate}</li>
        <li>{i18n.proofs}</li>
        <li>{i18n.references}</li>
        <li>{i18n.sets}</li>
      </ul>
    </div>
  );
};

export default Leftbar;
