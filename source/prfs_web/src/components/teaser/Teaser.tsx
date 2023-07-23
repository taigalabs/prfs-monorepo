import React from "react";
import Link from "next/link";

import styles from "./Teaser.module.scss";
import { i18nContext } from "@/contexts/i18n";

const Teaser: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div>2023 H2</div>
      <div>{i18n.teaser_1}</div>
      <div>{i18n.teaser_2}</div>
    </div>
  );
};

export default Teaser;
