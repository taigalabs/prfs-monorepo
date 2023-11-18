import React from "react";
import Logo from "@taigalabs/prfs-react-components/src/logo/Logo";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import Link from "next/link";
import ActiveLink from "@taigalabs/prfs-react-components/src/active_link/ActiveLink";

import styles from "./RightBar.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

const SearchBar = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.searchBar}>
      <FaSearch />
      <input placeholder={i18n.search_proof_guide} />
    </div>
  );
};

const RightBar: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.searchBarContainer}>
        <SearchBar />
      </div>
    </div>
  );
};

export default RightBar;
