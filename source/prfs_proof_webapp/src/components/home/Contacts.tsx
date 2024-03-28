import React from "react";
import cn from "classnames";
import { MdArrowForward } from "@react-icons/all-files/md/MdArrowForward";
import HoverableText from "@taigalabs/prfs-react-lib/src/hoverable_text/HoverableText";
import Link from "next/link";

import styles from "./Contacts.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { urls } from "@/urls";
import { paths } from "@/paths";
import { Area, Subtitle, Title } from "./IntroComponents";

const Contacts: React.FC<LogoContainerProps> = () => {
  const i18n = useI18N();

  return (
    <Area className={styles.wrapper}>
      <Subtitle>Reach out to us via</Subtitle>
      <ul className={styles.itemContainer}>
        <li className={styles.item}>Telegram (Shy)</li>
        <li className={styles.item}>Twitter (Shy)</li>
      </ul>
    </Area>
  );
};

export default Contacts;

export interface LogoContainerProps {}
