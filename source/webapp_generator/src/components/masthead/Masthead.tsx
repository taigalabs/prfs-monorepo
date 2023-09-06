import React from "react";
import Logo from "@taigalabs/prfs-react-components/src/logo/Logo";

import styles from "./Masthead.module.scss";
import { i18nContext } from "@/contexts/i18n";

const Masthead: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div>
        <Logo variant="simple" />
      </div>
      <ul>
        <li>{i18n.proof}</li>
        <li>3</li>
        <li>3</li>
        <li>3</li>
        <li>3</li>
      </ul>
    </div>
  );
};

export default Masthead;
