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
import PrfsAppsPopoverDefault from "@/components/prfs_apps_popover_default/PrfsAppsPopoverDefault";
import {
  MastheadLogoArea,
  MastheadMain,
  MastheadRightGroup,
  MastheadRightGroupMenu,
  MastheadWrapper,
} from "@/components/masthead/MastheadComponents";
import { envs } from "@/envs";

const ProofTypeSelectedMasthead: React.FC<ProofTypeMastheadProps> = ({
  isActivated,
  prfsProofId,
  proofType,
  handleSelectProofType,
}) => {
  const i18n = React.useContext(i18nContext);

  return (
    <MastheadWrapper twoColumn>
      <MastheadLogoArea>
        <a href={paths.__}>
          <ImageLogo width={50} height={40} />
        </a>
      </MastheadLogoArea>
      <MastheadMain>
        <div className={styles.searchArea}>
          <SearchProofDialog
            isActivated={isActivated}
            prfsProofId={prfsProofId}
            proofType={proofType}
            handleSelectProofType={handleSelectProofType}
            proofWebappEndpoint={envs.NEXT_PUBLIC_PRFS_PROOF_WEBAPP_ENDPOINT}
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
          {/* <MastheadRightGroupMenu className={cn(styles.signInBtn)}> */}
          {/*   <PrfsIdSignInBtn appId={PRFS_PROOF_APP_ID} /> */}
          {/* </MastheadRightGroupMenu> */}
        </MastheadRightGroup>
      </MastheadMain>
    </MastheadWrapper>
  );
};

export default ProofTypeSelectedMasthead;

export interface ProofTypeMastheadProps {
  isActivated?: boolean;
  prfsProofId: string | null;
  proofType: PrfsProofType | null;
  handleSelectProofType: (proofType: PrfsProofType) => void;
}
