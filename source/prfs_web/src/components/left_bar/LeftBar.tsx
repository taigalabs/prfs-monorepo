import React from "react";
import Link from "next/link";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import styles from "./LeftBar.module.scss";
import { i18nContext } from "@/contexts/i18n";
import ActiveLink from "@/components/active_link/ActiveLink";

const Leftbar: React.FC<any> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <ul className={styles.topMenu}>
        <li>
          <ActiveLink href="/" exact activeClassName={styles.activeLink}>
            {i18n.home}
          </ActiveLink>
        </li>
      </ul>
      <div className={styles.section}>
        <ul>
          <li className={styles.category}>
            <ArrowRightIcon />
            {i18n.proofs}
          </li>
          <li>
            <ActiveLink href="/proofs" activeClassName={styles.activeLink}>
              {i18n.proof_instances}
            </ActiveLink>
          </li>
          <li>
            <ActiveLink href="/proof_types" activeClassName={styles.activeLink}>
              {i18n.proof_types}
            </ActiveLink>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <ul>
          <li className={styles.category}>
            <ArrowRightIcon />
            {i18n.circuits}
          </li>
          <li>
            <ActiveLink href="/circuits" activeClassName={styles.activeLink}>
              {i18n.circuits}
            </ActiveLink>
          </li>
          <li>
            <ActiveLink href="/drivers" activeClassName={styles.activeLink}>
              {i18n.circuit_drivers}
            </ActiveLink>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <ul>
          <li className={styles.category}>
            <ArrowRightIcon />
            {i18n.references}
          </li>
          <li>
            <ActiveLink href="/sets" activeClassName={styles.activeLink}>
              {i18n.sets}
            </ActiveLink>
          </li>
          <li>
            <ActiveLink href="/#dynamic_sets" activeClassName={styles.activeLink}>
              {i18n.dynamic_sets}
            </ActiveLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Leftbar;
