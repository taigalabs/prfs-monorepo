import React from "react";
import { CircuitInput } from "@taigalabs/prfs-entities/bindings/CircuitInput";
import { RiArrowUpSLine } from "react-icons/ri";

import styles from "./Terminal.module.scss";
import { i18nContext } from "@/contexts/i18n";

const Terminal: React.FC<TerminalProps> = ({ children }) => {
  const i18n = React.useContext(i18nContext);

  React.useEffect(() => {}, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <RiArrowUpSLine />
      </div>
      <div className={styles.log}>{children}</div>
    </div>
  );
};

export default Terminal;

export interface TerminalProps {
  children: React.ReactNode;
}
