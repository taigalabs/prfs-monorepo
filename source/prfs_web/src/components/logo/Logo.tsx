import React from "react";

import styles from "./Logo.module.scss";
import { I18nContext } from "@/contexts";

const Logo = () => {
  const i18n = React.useContext(I18nContext);

  return <div className={styles.wrapper}>{i18n.prfs}</div>;
};

export default Logo;
