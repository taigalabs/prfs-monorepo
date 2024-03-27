import React from "react";
import cn from "classnames";
import { MdArrowForward } from "@react-icons/all-files/md/MdArrowForward";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";
import Link from "next/link";

import styles from "./Specialties.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { urls } from "@/urls";
import { paths } from "@/paths";
import { Area, Title } from "./IntroComponents";

const Specialties: React.FC<LogoContainerProps> = () => {
  const i18n = useI18N();

  return (
    <Area>
      <Title>Build with the latest innovation, without forsaking practicality</Title>
      <ul className={styles.itemContainer}>
        <li className={styles.item}>
          <p>Universality</p>
          <p>An interface that is not tied to any specific blockchain, zk-dsl, or proof systems.</p>
        </li>
        <li className={styles.item}>
          <p>Client-side</p>
          <p></p>
        </li>
        <li className={styles.item}>
          <p>Pragmatic</p>
          <p></p>
        </li>
        <li className={styles.item}>
          <p>Performant</p>
          <p></p>
        </li>
      </ul>
    </Area>
  );
};

export default Specialties;

export interface LogoContainerProps {}
