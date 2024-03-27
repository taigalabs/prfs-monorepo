import React from "react";
import cn from "classnames";

import styles from "./Specialties.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { Area, Title } from "./IntroComponents";

const Specialties: React.FC<LogoContainerProps> = () => {
  const i18n = useI18N();

  return (
    <Area>
      <Title>Build with the latest innovation, without forsaking practicality</Title>
      <ul className={styles.itemContainer}>
        <li className={styles.item}>
          <p className={styles.title}>Universality</p>
          <p>An interface that is not tied to any specific blockchain, zk-dsl, or proof systems.</p>
        </li>
        <li className={styles.item}>
          <p className={styles.title}>Client-side</p>
          <p>
            We believe a user should be able to do the critical operation on her data by herself.
          </p>
        </li>
        <li className={styles.item}>
          <p className={styles.title}>Pragmatic</p>
          <p></p>
        </li>
        <li className={styles.item}>
          <p className={styles.title}>Performant</p>
          <p></p>
        </li>
      </ul>
    </Area>
  );
};

export default Specialties;

export interface LogoContainerProps {}
