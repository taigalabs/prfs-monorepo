import React from "react";
import Link from "next/link";

import styles from "./Masthead.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Logo from "@/components/logo/Logo";

const Masthead: React.FC<any> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftMenu}>
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <div>
        <ul className={styles.mainMenu}>
          <li>{i18n.learn}</li>
        </ul>
      </div>
      <div className={styles.rightMenu}>
        <Link href="/signin">connect</Link>
      </div>
    </div>
  );
};

export default Masthead;
