"use client";

import React from "react";
import cn from "classnames";
import Link from "next/link";
import { BsBook } from "@react-icons/all-files/bs/BsBook";
import { IoIosMenu } from "@react-icons/all-files/io/IoIosMenu";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";
import Tooltip from "@taigalabs/prfs-react-components/src/tooltip/Tooltip";

import styles from "./AccVerificationMasthead.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import PrfsIdSignInBtn from "@/components/prfs_id_sign_in_btn/PrfsIdSignInBtn";
import PrfsAppsPopoverDefault from "@/components/prfs_apps_popover_default/PrfsAppsPopoverDefault";
import {
  MastheadLogoArea,
  MastheadMain,
  MastheadRightGroup,
  MastheadRightGroupMenu,
  MastheadWrapper,
} from "@/components/masthead/Masthead";
import VerifiedAccSearch from "@/components/verified_acc_search/VerifiedAccSearch";
import AccVerifyLogoArea from "./AccVerifyLogoArea";

const AccVerificationMasthead: React.FC<AccVerificationMastheadProps> = ({
  handleClickShowLeftBar,
  handleClickShowLeftBarDrawer,
}) => {
  const i18n = React.useContext(i18nContext);

  return (
    <MastheadWrapper smallPadding tallHeight>
      <div className={styles.leftBarBtn}>
        <AccVerifyLogoArea handleClickShowLeftBar={handleClickShowLeftBar} />
      </div>
      <div className={styles.leftBarDrawerBtn}>
        <AccVerifyLogoArea handleClickShowLeftBar={handleClickShowLeftBarDrawer} />
      </div>
      <MastheadMain>
        <div className={styles.searchArea}>
          <VerifiedAccSearch />
        </div>
        <MastheadRightGroup className={styles.rightGroup}>
          <Tooltip label={i18n.docs} className={styles.sideMargin}>
            <MastheadRightGroupMenu className={cn(styles.entry, styles.bigScreen)}>
              <Link href={process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}>
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

export default AccVerificationMasthead;

export interface AccVerificationMastheadProps {
  handleClickShowLeftBar: () => void;
  handleClickShowLeftBarDrawer: () => void;
}
