"use client";

import React from "react";
import cn from "classnames";

import styles from "./HomeMasthead.module.scss";
import { i18nContext } from "@/i18n/context";
import PrfsIdSignInBtn from "@/components/prfs_id_sign_in_btn/PrfsIdSignInBtn";
import { useIsTutorial } from "@/hooks/tutorial";
import { useUrls } from "@/hooks/useUrls";
import PrfsAppsPopoverDefault from "../prfs_apps_popover_default/PrfsAppsPopoverDefault";

const HomeMasthead: React.FC<HomeMastheadProps> = () => {
  const i18n = React.useContext(i18nContext);
  const isTutorial = useIsTutorial();
  const { tutorialUrl } = useUrls();

  return (
    <div className={cn({ [styles.wrapper]: true, [styles.isTutorial]: isTutorial })}>
      <div className={styles.inner}>
        <ul className={styles.rightGroup}>
          <li className={cn(styles.menu, styles.underline, styles.tutorialBtn)}>
            <a href={tutorialUrl}>
              <span>{i18n.tutorial}</span>
            </a>
          </li>
          <li className={styles.menu}>
            <PrfsAppsPopoverDefault />
          </li>
          <li className={cn(styles.menu, styles.signInBtn)}>
            <PrfsIdSignInBtn />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HomeMasthead;

export interface HomeMastheadProps {}
