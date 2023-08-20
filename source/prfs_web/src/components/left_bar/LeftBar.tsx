import React from "react";
import cn from "classnames";
import Link from "next/link";
import { FaAngleRight } from "react-icons/fa6";
import { FaHatWizard } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { MdSpaceDashboard, MdOutlineDocumentScanner } from "react-icons/md";
import { IoDocumentTextOutline, IoDocument } from "react-icons/io5";
import { GrDocumentText } from "react-icons/gr";
import { AiFillFolder } from "react-icons/ai";
import { PiCircuitry, PiCircuitryFill } from "react-icons/pi";
import { AiTwotoneTool } from "react-icons/ai";
import { TbTable, TbTableAlias } from "react-icons/tb";

import styles from "./LeftBar.module.scss";
import { i18nContext } from "@/contexts/i18n";
import ActiveLink from "@/components/active_link/ActiveLink";
import ProjectMeta from "../project_meta/ProjectMeta";
import { paths } from "@/routes/path";

const Leftbar: React.FC<any> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.section}>
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
          <li>
            <ActiveLink href={paths.proof} exact activeClassName={styles.activeLink}>
              <div className={styles.button}>
                <MdSpaceDashboard />
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
            <ActiveLink href={paths.proof__proof_instances} activeClassName={styles.activeLink}>
              <div className={cn(styles.button, styles.bold)}>
                <IoDocumentTextOutline />
                <span>{i18n.proof_instances}</span>
              </div>
            </ActiveLink>
          </li>
          <li>
            <ActiveLink href={paths.proof__proof_types} activeClassName={styles.activeLink}>
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
            <ActiveLink href={paths.proof__circuits} activeClassName={styles.activeLink}>
              <div className={cn(styles.button, styles.bold)}>
                <PiCircuitry />
                <span>{i18n.circuits}</span>
              </div>
            </ActiveLink>
          </li>
          <li>
            <ActiveLink href={paths.proof__circuit_drivers} activeClassName={styles.activeLink}>
              <div className={styles.button}>
                <AiTwotoneTool />
                <span>{i18n.circuit_drivers}</span>
              </div>
            </ActiveLink>
          </li>
          <li>
            <ActiveLink href={paths.proof__circuit_types} activeClassName={styles.activeLink}>
              <div className={styles.button}>
                <PiCircuitryFill />
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
            <ActiveLink href={paths.proof__sets} activeClassName={styles.activeLink}>
              <div className={cn(styles.button, styles.bold)}>
                <TbTable />
                <span>{i18n.sets}</span>
              </div>
            </ActiveLink>
          </li>
          <li>
            <ActiveLink href={paths.proof__dynamic_sets} activeClassName={styles.activeLink}>
              <div className={cn(styles.button, styles.bold)}>
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
