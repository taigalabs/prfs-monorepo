import React from "react";
import cn from "classnames";

import styles from "./VerifiedAccSearch.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";

const VerifiedAccSearch: React.FC<VerifiedAccSearchProps> = ({}) => {
  const i18n = React.useContext(i18nContext);

  // tbd
  return <div className={styles.searchArea}></div>;
};

export default VerifiedAccSearch;

export interface VerifiedAccSearchProps {}
