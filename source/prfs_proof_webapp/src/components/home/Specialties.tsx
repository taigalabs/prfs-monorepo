import React from "react";
import cn from "classnames";

import styles from "./Specialties.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { Area, Title } from "./HomeComponents";

const Specialties: React.FC<LogoContainerProps> = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.sectionTitle}>
          <p className={styles.titleContent}>
            Build with the latest innovation, <br />
            never letting go practicality
          </p>
        </div>
        <ul className={styles.itemContainer}>
          <li className={styles.item}>
            <p className={styles.title}>Universality</p>
            <p className={styles.desc}>
              An interface that is not tied to any specific blockchain, zk-dsl, or proof systems.
              Prfs enables different finite fields and proof algorithms to run.
            </p>
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Client-side</p>
            <p className={styles.desc}>A user does the critical operation on her data.</p>
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Pragmatic</p>
            <p className={styles.desc}>
              Verifiable computing optimized enough to run in a resource-constrained environment of
              consumer devices.
            </p>
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Performant</p>
            <p className={styles.desc}>
              Leveraging the latest techniques in optimization, we enable a reasonably fast and
              secure proving operation
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Specialties;

export interface LogoContainerProps {}
