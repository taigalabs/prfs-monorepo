import React from "react";
import cn from "classnames";
import Button from "@taigalabs/prfs-react-components/src/button/Button";
import Link from "next/link";
import { HiPlus } from "@react-icons/all-files/hi/HiPlus";

import styles from "./LeftBar.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import AccVerificationMasthead from "@/components/acc_verification_masthead/AccVerificationMasthead";
import { MastheadPlaceholder } from "@/components/masthead/Masthead";

const LeftBar: React.FC<LeftBarProps> = () => {
  const i18n = React.useContext(i18nContext);

  const handleClickShowLeftBar = React.useCallback(() => {}, []);

  return (
    <div className={styles.wrapper}>
      <ul className={styles.topList}>
        <li className={styles.menu}>
          <Button
            variant="light_blue_1"
            handleClick={() => {}}
            className={styles.addBtn}
            contentClassName={styles.addBtnContent}
          >
            <HiPlus />
            <span>{i18n.add_attestation}</span>
          </Button>
        </li>
      </ul>
      <ul className={styles.menuList}>
        <li className={styles.menu}>{i18n.x_twitter}</li>
      </ul>
    </div>
  );
};

export default LeftBar;

export interface LeftBarProps {}
