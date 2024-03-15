import React from "react";
import cn from "classnames";

import styles from "./VerifyProofModule.module.scss";
import { i18nContext } from "@/i18n/context";

const Welcome: React.FC<WelcomeProps> = ({}) => {
  const i18n = React.useContext(i18nContext);

  return <div className={styles.wrapper}>welcome</div>;
};

export default Welcome;

export interface WelcomeProps {}
