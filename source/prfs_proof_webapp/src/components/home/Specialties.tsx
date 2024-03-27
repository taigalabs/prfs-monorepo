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
      <Title>{i18n.things_that_make_prfs_special}</Title>
      <ul className={styles.itemContainer}>
        <li className={styles.item}>{i18n.proof}</li>
        <li className={styles.item}>{i18n.attestation}</li>
      </ul>
    </Area>
  );
};

export default Specialties;

export interface LogoContainerProps {}
