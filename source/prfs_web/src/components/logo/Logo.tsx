import React from "react";

import styles from "./Logo.module.scss";
import { i18nContext } from "@/contexts/i18n";

const Logo = () => {
  const i18n = React.useContext(i18nContext);

  return <div className={styles.wrapper}>{i18n.prfs}</div>;
};

export default Logo;
