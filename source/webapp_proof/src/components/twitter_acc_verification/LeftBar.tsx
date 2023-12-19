import React from "react";
import cn from "classnames";

import styles from "./LeftBar.module.scss";
import { i18nContext } from "@/i18n/context";
import Link from "next/link";
import { paths } from "@/paths";
import AccVerificationMasthead from "@/components/acc_verification_masthead/AccVerificationMasthead";
import { MastheadPlaceholder } from "@/components/masthead/Masthead";

const LeftBar: React.FC<LeftBarProps> = () => {
  const i18n = React.useContext(i18nContext);

  const handleClickShowLeftBar = React.useCallback(() => {}, []);

  return (
    <div className={styles.wrapper}>
      <ul>
        <li>{i18n.x_twitter}</li>
      </ul>
    </div>
  );
};

export default LeftBar;

export interface LeftBarProps {}
