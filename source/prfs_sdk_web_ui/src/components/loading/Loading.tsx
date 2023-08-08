import React from "react";

import styles from "./Loading.module.scss";
import { i18nContext } from "@/contexts/i18n";

const Loading: React.FC<LoadingProps> = () => {
  const i18n = React.useContext(i18nContext);

  return <div className={styles.wrapper}>{i18n.loading}</div>;
};

export default Loading;

export interface LoadingProps {}
