"use client";

import React from "react";
import cn from "classnames";
import Link from "next/link";
import { BsBook } from "@react-icons/all-files/bs/BsBook";
import Tooltip from "@taigalabs/prfs-react-lib/src/tooltip/Tooltip";

import styles from "./SetsMasthead.module.scss";
import { i18nContext } from "@/i18n/context";
import PrfsIdSignInBtn from "@/components/prfs_id_sign_in_btn/PrfsIdSignInBtn";
import PrfsAppsPopoverDefault from "@/components/prfs_apps_popover_default/PrfsAppsPopoverDefault";
import {
  MastheadMain,
  MastheadRightGroup,
  MastheadRightGroupMenu,
  MastheadWrapper,
} from "@/components/masthead/Masthead";
import VerifiedAccSearch from "@/components/verified_acc_search/VerifiedAccSearch";
import { envs } from "@/envs";
import AppLogo from "../app_logo/AppLogo";
import { paths } from "@/paths";

const SetsMasthead: React.FC<AttestationsMastheadProps> = ({
  handleClickShowLeftBar,
  handleClickShowLeftBarDrawer,
}) => {
  const i18n = React.useContext(i18nContext);

  return (
    <MastheadWrapper smallPadding tallHeight>
      <div className={styles.leftBarBtn}>
        <AppLogo
          handleClickShowLeftBar={handleClickShowLeftBar}
          url={paths.sets}
          label={i18n.sets}
        />
      </div>
      <div className={styles.leftBarDrawerBtn}>
        <AppLogo
          handleClickShowLeftBar={handleClickShowLeftBarDrawer}
          url={paths.sets}
          label={i18n.sets}
        />
      </div>
      <MastheadMain>
        <div className={styles.searchArea}>
          <VerifiedAccSearch />
        </div>
        <MastheadRightGroup className={styles.rightGroup}>
          <Tooltip label={i18n.docs} className={styles.sideMargin}>
            <MastheadRightGroupMenu className={cn(styles.entry, styles.bigScreen)}>
              <Link href={envs.NEXT_PUBLIC_PRFS_DOCS_WEBSITE_ENDPOINT}>
                <BsBook />
              </Link>
            </MastheadRightGroupMenu>
          </Tooltip>
          <MastheadRightGroupMenu
            className={cn(styles.entry, styles.appPopover, styles.sideMargin)}
          >
            <PrfsAppsPopoverDefault />
          </MastheadRightGroupMenu>
          <MastheadRightGroupMenu className={cn(styles.signInBtn)}>
            <PrfsIdSignInBtn />
          </MastheadRightGroupMenu>
        </MastheadRightGroup>
      </MastheadMain>
    </MastheadWrapper>
  );
};

export default SetsMasthead;

export interface AttestationsMastheadProps {
  handleClickShowLeftBar: (bool?: boolean) => void;
  handleClickShowLeftBarDrawer: (bool?: boolean) => void;
}
