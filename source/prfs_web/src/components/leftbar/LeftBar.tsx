import React from "react";
import Link from "next/link";

import styles from "./LeftBar.module.scss";
import { I18nContext } from "@/contexts";
import Logo from "@/components/logo/Logo";

const Leftbar: React.FC<any> = () => {
  const i18n = React.useContext(I18nContext);

  return (
    <div className={styles.wrapper}>
      <ul>
        <li>5</li>
      </ul>
    </div>
  );
};

export default Leftbar;
