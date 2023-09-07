import React from "react";
import Logo from "@taigalabs/prfs-react-components/src/logo/Logo";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import Link from "next/link";
import ActiveLink from "@taigalabs/prfs-react-components/src/active_link/ActiveLink";

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
      <div className={styles.leftMenu}>
        <div className={styles.logoContainer}>
          <Logo variant="simple" />
        </div>
        <ul>
          <li>
            <ActiveLink href={paths.generate}>{i18n.generate}</ActiveLink>
          </li>
          <li>
            <ActiveLink href={paths.explorer}>{i18n.explorer}</ActiveLink>
          </li>
        </ul>
      </div>
      <div>
        <SearchBar />
      </div>
      <div className={styles.rightMenu}>
        <ul>
          <li>
            <Link href={process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}>{i18n.console}</Link>
          </li>
          <li>account</li>
        </ul>
      </div>
    </div>
  );
};

export default Masthead;
