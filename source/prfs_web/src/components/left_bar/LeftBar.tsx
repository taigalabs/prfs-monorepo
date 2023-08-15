import React from "react";
import Link from "next/link";
import { FaAngleRight } from "react-icons/fa6";

import styles from "./LeftBar.module.scss";
import { i18nContext } from "@/contexts/i18n";
import ActiveLink from "@/components/active_link/ActiveLink";
import ProjectMeta from "../project_meta/ProjectMeta";

const Leftbar: React.FC<any> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.topSection}>
        <ul>
          <li>
            <ActiveLink href="/#proof_wizard" exact activeClassName={styles.activeLink}>
              <p>{i18n.proof_wizard}</p>
              <p className={styles.menuSublabel}>{i18n.proof_wizard_sublabel}</p>
            </ActiveLink>
          </li>
        </ul>
      </div>
      <div className={styles.homeSection}>
        <ul>
          <li>
            <ActiveLink href="/" exact activeClassName={styles.activeLink}>
              {i18n.home}
            </ActiveLink>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <ul>
          <li className={styles.category}>{i18n.proofs.toUpperCase()}</li>
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
          <li className={styles.category}>{i18n.circuits.toUpperCase()}</li>
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
          <li>
            <ActiveLink href="/circuit_types" activeClassName={styles.activeLink}>
              {i18n.circuit_types}
            </ActiveLink>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <ul>
          <li className={styles.category}>
            <span>{i18n.references.toUpperCase()}</span>
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
