import React from "react";
import Link from "next/link";

import styles from "./GlobalFooter.module.scss";
import { i18nContext } from "@/i18n/context";
import { envs } from "@/envs";

const GlobalFooter: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  const handleClickLink = React.useCallback((ev: React.MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault();

    const { href } = ev.currentTarget;
    if (href) {
      window.parent.window.open(href);
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <Link href={envs.NEXT_PUBLIC_CODE_REPOSITORY_URL} onClick={handleClickLink}>
        <span>{i18n.code}</span>
      </Link>
      <Link href={envs.NEXT_PUBLIC_PRFS_PROOF_WEBAPP_ENDPOINT} onClick={handleClickLink}>
        <span>{i18n.prfs}</span>
      </Link>
    </div>
  );
};

export default GlobalFooter;
