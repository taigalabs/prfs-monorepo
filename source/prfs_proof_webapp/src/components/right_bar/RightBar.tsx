import React from "react";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";

import styles from "./RightBar.module.scss";
import { i18nContext } from "@/i18n/context";

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
  return (
    <div className={styles.wrapper}>
      <div className={styles.searchBarContainer}>
        <SearchBar />
      </div>
    </div>
  );
};

export default RightBar;
