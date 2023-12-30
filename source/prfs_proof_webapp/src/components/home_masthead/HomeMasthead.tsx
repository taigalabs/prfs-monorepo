"use client";

import React from "react";
import cn from "classnames";

import styles from "./HomeMasthead.module.scss";
import { i18nContext } from "@/i18n/context";
import PrfsIdSignInBtn from "@/components/prfs_id_sign_in_btn/PrfsIdSignInBtn";
import { useUrls } from "@/hooks/useUrls";
import PrfsAppsPopoverDefault from "@/components/prfs_apps_popover_default/PrfsAppsPopoverDefault";
import {
  MastheadRightGroup,
  MastheadRightGroupMenu,
  MastheadWrapper,
} from "@/components/masthead/Masthead";

const HomeMasthead: React.FC<HomeMastheadProps> = () => {
  const i18n = React.useContext(i18nContext);
  const { tutorialUrl } = useUrls();

  return (
    <MastheadWrapper>
      <MastheadRightGroup>
        <MastheadRightGroupMenu className={cn(styles.menu, styles.underline, styles.tutorialBtn)}>
          {/* <a href={tutorialUrl}> */}
          {/*   <span>{i18n.tutorial}</span> */}
          {/* </a> */}
        </MastheadRightGroupMenu>
        <MastheadRightGroupMenu className={styles.menu}>
          <PrfsAppsPopoverDefault disableMarkIsOpen />
        </MastheadRightGroupMenu>
        <MastheadRightGroupMenu className={cn(styles.signInBtn, styles.menu)}>
          <PrfsIdSignInBtn />
        </MastheadRightGroupMenu>
      </MastheadRightGroup>
    </MastheadWrapper>
  );
};

export default HomeMasthead;

export interface HomeMastheadProps {}
