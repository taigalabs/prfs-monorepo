"use client";

import React from "react";
import cn from "classnames";
import Link from "next/link";
import { BsBook } from "@react-icons/all-files/bs/BsBook";
import Tooltip from "@taigalabs/prfs-react-lib/src/tooltip/Tooltip";

import styles from "./ProofTypeMasthead.module.scss";
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
import AppLogo from "@/components/app_logo/AppLogo";
import { paths } from "@/paths";
import { PRFS_PROOF } from "@/app_id";

const ProofTypeMasthead: React.FC<ProofTypeMastheadProps> = ({
  handleClickShowLeftBar,
  handleClickShowLeftBarDrawer,
}) => {
  const i18n = React.useContext(i18nContext);

  return (
    <MastheadWrapper smallPadding tallHeight>
      <div className={styles.leftBarBtn}>
        <AppLogo
          handleClickShowLeftBar={handleClickShowLeftBar}
          url={paths.attestations}
          label={i18n.attestations}
        />
      </div>
      <div className={styles.leftBarDrawerBtn}>
        <AppLogo
          handleClickShowLeftBar={handleClickShowLeftBarDrawer}
          url={paths.proof_types}
          label={i18n.proof_types}
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
            <PrfsIdSignInBtn appId={PRFS_PROOF} />
          </MastheadRightGroupMenu>
        </MastheadRightGroup>
      </MastheadMain>
    </MastheadWrapper>
  );
};

export default ProofTypeMasthead;

export interface ProofTypeMastheadProps {
  handleClickShowLeftBar: (bool?: boolean) => void;
  handleClickShowLeftBarDrawer: (bool?: boolean) => void;
}
