import React from "react";
import Link from "next/link";
import { FaAngleRight } from "react-icons/fa6";
import { FaHatWizard } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";

import styles from "./LeftBar.module.scss";
import { i18nContext } from "@/contexts/i18n";
import ActiveLink from "@/components/active_link/ActiveLink";
import ProjectMeta from "../project_meta/ProjectMeta";
import { paths } from "@/routes/path";

const Leftbar: React.FC<any> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.topSection}>
        <ul>
          <li>
            <ActiveLink href={paths.proof__proof_wizard} exact activeClassName={styles.activeLink}>
              <div className={styles.button}>
                <FaHatWizard />
                <div>
                  <p>{i18n.proof_wizard}</p>
                  <p className={styles.menuSublabel}>{i18n.proof_wizard_sublabel}</p>
                </div>
              </div>
            </ActiveLink>
          </li>
        </ul>
      </div>
      <div className={styles.homeSection}>
        <ul>
          <li>
            <ActiveLink href={paths.proof} exact activeClassName={styles.activeLink}>
              <div className={styles.button}>
                <MdSpaceDashboard />
                {i18n.dashboard}
              </div>
            </ActiveLink>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <ul>
          <li className={styles.category}>{i18n.proofs.toUpperCase()}</li>
          <li>
            <ActiveLink href={paths.proof__proof_instances} activeClassName={styles.activeLink}>
              {i18n.proof_instances}
            </ActiveLink>
          </li>
          <li>
            <ActiveLink href={paths.proof__proof_types} activeClassName={styles.activeLink}>
              {i18n.proof_types}
            </ActiveLink>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <ul>
          <li className={styles.category}>{i18n.circuits.toUpperCase()}</li>
          <li>
            <ActiveLink href={paths.proof__circuits} activeClassName={styles.activeLink}>
              {i18n.circuits}
            </ActiveLink>
          </li>
          <li>
            <ActiveLink href={paths.proof__circuit_drivers} activeClassName={styles.activeLink}>
              {i18n.circuit_drivers}
            </ActiveLink>
          </li>
          <li>
            <ActiveLink href={paths.proof__circuit_types} activeClassName={styles.activeLink}>
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
            <ActiveLink href={paths.proof__sets} activeClassName={styles.activeLink}>
              {i18n.sets}
            </ActiveLink>
          </li>
          <li>
            <ActiveLink href={paths.proof__dynamic_sets} activeClassName={styles.activeLink}>
              {i18n.dynamic_sets}
            </ActiveLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Leftbar;
