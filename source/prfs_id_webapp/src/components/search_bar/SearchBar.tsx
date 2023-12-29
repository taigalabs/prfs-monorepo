import React from "react";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";

import styles from "./SearchBar.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";

const SearchBar = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.searchBarContainer}>
      <div className={styles.searchBar}>
        <FaSearch />
        <input placeholder={i18n.search_guide} />
      </div>
    </div>
  );
};

export default SearchBar;
