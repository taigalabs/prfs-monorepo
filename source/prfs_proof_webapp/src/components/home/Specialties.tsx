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
              Prfs enables different finite fields or proof algorithms to run on the system.
            </p>
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Client-side</p>
            <p>
              We believe a user should be able to do the critical operation on her data by herself.
            </p>
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Pragmatic</p>
            <p>Verifiable computing in a resource-constrained environment of edge devices.</p>
          </li>
          <li className={styles.item}>
            <p className={styles.title}>Performant</p>
            <p>
              With data pre-processing and proof system optimzation, we enable proving that can run
              reasonably fast.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Specialties;

export interface LogoContainerProps {}
