import React from "react";

import styles from "./ContentArea.module.scss";

const Header: React.FC<HeaderProps> = ({ children }) => {
  // let i18n = React.useContext(i18nContext);

  // const valueElem = React.useMemo(() => {
  //   return JSON.stringify(publicInputs);
  // }, [publicInputs]);

  return <div className={styles.header}>{children}</div>;
};

export default Header;

export interface HeaderProps {
  children: React.ReactNode;
}
