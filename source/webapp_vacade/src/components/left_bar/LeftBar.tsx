import React from "react";
import Logo from "@taigalabs/prfs-react-components/src/logo/Logo";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import Link from "next/link";
import ActiveLink from "@taigalabs/prfs-react-components/src/active_link/ActiveLink";

import styles from "./LeftBar.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";

// const SearchBar = () => {
//   const i18n = React.useContext(i18nContext);

//   return (
//     <div className={styles.searchBar}>
//       <FaSearch />
//       <input placeholder={i18n.search_guide} />
//     </div>
//   );
// };

const LeftBar: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.logoContainer}>
        <Link href={paths.__}>
          <p>{i18n.vacade}</p>
        </Link>
        <p className={styles.betaTag}>Beta</p>
      </div>
      <ul className={styles.mainMenu}>
        <li>
          <ActiveLink href={paths.__} exact>
            {i18n.home}
          </ActiveLink>
        </li>
        <li>
          <ActiveLink href={paths.proofs}>{i18n.crypto}</ActiveLink>
        </li>
      </ul>
    </div>
  );
};

export default LeftBar;
