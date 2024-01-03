import React from "react";
import Logo from "@taigalabs/prfs-react-lib/src/logo/Logo";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import Link from "next/link";
import ActiveLink from "@taigalabs/prfs-react-lib/src/active_link/ActiveLink";

import styles from "./Masthead.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const SearchBar = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.searchBar}>
      <FaSearch />
      <input placeholder={i18n.search_guide} />
    </div>
  );
};

const Masthead: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.leftGroup}>
          <div className={styles.logoContainer}>
            <Link href={paths.__}>
              <Logo variant="simple" />
              <p className={styles.appName}>{i18n.poll}</p>
            </Link>
            <p className={styles.betaTag}>Beta</p>
          </div>
          <ul className={styles.leftMenu}>
            <li>
              <ActiveLink href={paths.__} exact>
                {i18n.polls}
              </ActiveLink>
            </li>
            <li>
              <ActiveLink href={paths.create} exact>
                {i18n.create}
              </ActiveLink>
            </li>
          </ul>
        </div>
        <div className={styles.searchBarContainer}>
          <SearchBar />
        </div>
        <ul className={styles.rightGroup}>
          <li>
            <Link href={process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}>{i18n.console}</Link>
          </li>
          <li>{i18n.account}</li>
        </ul>
      </div>
    </div>
  );
};

export default Masthead;
