"use client";

import React from "react";
import cn from "classnames";
import Link from "next/link";
import { BsBook } from "@react-icons/all-files/bs/BsBook";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import SearchProofDialog from "@taigalabs/prfs-react-lib/src/search_proof_dialog/SearchProofDialog";
import ImageLogo from "@taigalabs/prfs-react-lib/src/image_logo/ImageLogo";
import Tooltip from "@taigalabs/prfs-react-lib/src/tooltip/Tooltip";

import styles from "./ProofTypeSelectedMasthead.module.scss";
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
import { envs } from "@/envs";
import { PRFS_PROOF_APP_ID } from "@/app_id";

const ProofTypeSelectedMasthead: React.FC<ProofTypeMastheadProps> = ({
  isActivated,
  proofInstanceId,
  proofType,
  handleSelectProofType,
}) => {
  const i18n = React.useContext(i18nContext);

  return (
    <MastheadWrapper twoColumn>
      <MastheadLogoArea>
        <a href={paths.__}>
          <ImageLogo width={50} />
        </a>
      </MastheadLogoArea>
      <MastheadMain>
        <div className={styles.searchArea}>
          <SearchProofDialog
            isActivated={isActivated}
            proofInstanceId={proofInstanceId}
            proofType={proofType}
            handleSelectProofType={handleSelectProofType}
            webappConsoleEndpoint={process.env.NEXT_PUBLIC_PRFS_CONSOLE_WEBAPP_ENDPOINT}
          />
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
            <PrfsIdSignInBtn appId={PRFS_PROOF_APP_ID} />
          </MastheadRightGroupMenu>
        </MastheadRightGroup>
      </MastheadMain>
    </MastheadWrapper>
  );
};

export default ProofTypeSelectedMasthead;

export interface ProofTypeMastheadProps {
  isActivated?: boolean;
  proofInstanceId: string | undefined;
  proofType: PrfsProofType | undefined;
  handleSelectProofType: (proofType: PrfsProofType) => void;
}
