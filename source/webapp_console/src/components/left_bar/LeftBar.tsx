import React from "react";
import cn from "classnames";
import Link from "next/link";
import { FaHatWizard } from "@react-icons/all-files/fa/FaHatWizard";
import { MdDashboard } from "@react-icons/all-files/md/MdDashboard";
import { IoDocumentTextOutline } from "@react-icons/all-files/io5/IoDocumentTextOutline";
import { IoDocument } from "@react-icons/all-files/io5/IoDocument";
import { AiTwotoneTool } from "@react-icons/all-files/ai/AiTwotoneTool";
import { Circuitry } from "@phosphor-icons/react";
import { TbTable } from "@taigalabs/prfs-react-components/src/tabler_icons/TbTable";
import { TbTableAlias } from "@taigalabs/prfs-react-components/src/tabler_icons/TbTableAlias";

import styles from "./LeftBar.module.scss";
import { i18nContext } from "@/contexts/i18n";
import ActiveLink from "@/components/active_link/ActiveLink";
import { paths } from "@/paths";

const Leftbar: React.FC<any> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
        <ul>
          <li>
            <ActiveLink href={paths.proof_wizard} exact activeClassName={styles.activeLink}>
              <div className={styles.button}>
                <FaHatWizard />
                <div>
                  <p>{i18n.proof_wizard}</p>
                  <p className={styles.menuSublabel}>{i18n.proof_wizard_sublabel}</p>
                </div>
              </div>
            </ActiveLink>
          </li>
          <li>
            <ActiveLink href={paths.__} exact activeClassName={styles.activeLink}>
              <div className={styles.button}>
                <MdDashboard />
                <span>{i18n.dashboard}</span>
              </div>
            </ActiveLink>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <ul>
          <li className={styles.category}>{i18n.proofs}</li>
          <li>
            <ActiveLink href={paths.proof_instances} activeClassName={styles.activeLink}>
              <div className={cn(styles.button)}>
                <IoDocumentTextOutline />
                <span>{i18n.proof_instances}</span>
              </div>
            </ActiveLink>
          </li>
          <li>
            <ActiveLink href={paths.proof_types} activeClassName={styles.activeLink}>
              <div className={styles.button}>
                <IoDocument />
                <span>{i18n.proof_types}</span>
              </div>
            </ActiveLink>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <ul>
          <li className={styles.category}>{i18n.circuits}</li>
          <li>
            <ActiveLink href={paths.circuits} activeClassName={styles.activeLink}>
              <div className={cn(styles.button)}>
                <Circuitry />
                <span>{i18n.circuits}</span>
              </div>
            </ActiveLink>
          </li>
          <li>
            <ActiveLink href={paths.circuit_drivers} activeClassName={styles.activeLink}>
              <div className={styles.button}>
                <AiTwotoneTool />
                <span>{i18n.circuit_drivers}</span>
              </div>
            </ActiveLink>
          </li>
          <li>
            <ActiveLink href={paths.circuit_types} activeClassName={styles.activeLink}>
              <div className={styles.button}>
                <Circuitry />
                <span>{i18n.circuit_types}</span>
              </div>
            </ActiveLink>
          </li>
        </ul>
      </div>
      <div className={styles.section}>
        <ul>
          <li className={styles.category}>
            <span>{i18n.references}</span>
          </li>
          <li>
            <ActiveLink href={paths.sets} activeClassName={styles.activeLink}>
              <div className={cn(styles.button)}>
                <TbTable />
                <span>{i18n.sets}</span>
              </div>
            </ActiveLink>
          </li>
          <li>
            <ActiveLink href={paths.dynamic_sets} activeClassName={styles.activeLink}>
              <div className={cn(styles.button)}>
                <TbTableAlias />
                <span>{i18n.dynamic_sets}</span>
              </div>
            </ActiveLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Leftbar;
