"use client";

import React from "react";
import cn from "classnames";
import Link from "next/link";
import { BsBook } from "@react-icons/all-files/bs/BsBook";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import SearchProofDialog from "@taigalabs/prfs-react-components/src/search_proof_dialog/SearchProofDialog";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";
import Tooltip from "@taigalabs/prfs-react-components/src/tooltip/Tooltip";

import styles from "./ProofTypeMasthead.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import { useIsTutorial } from "@/hooks/tutorial";
import PrfsIdSignInBtn from "@/components/prfs_id_sign_in_btn/PrfsIdSignInBtn";
import PrfsAppsPopoverDefault from "@/components/prfs_apps_popover_default/PrfsAppsPopoverDefault";
import { MastheadRightGroup, MastheadRightGroupMenu, MastheadWrapper } from "../masthead/Masthead";

const ProofTypeMasthead: React.FC<ProofTypeMastheadProps> = ({
  isActivated,
  proofInstanceId,
  proofType,
  handleSelectProofType,
}) => {
  const i18n = React.useContext(i18nContext);
  const isTutorial = useIsTutorial();

  return (
    <MastheadWrapper className={styles.wrapper}>
      <div className={styles.logoArea}>
        <a href={paths.__}>
          <ImageLogo width={50} />
        </a>
      </div>
      <div className={styles.main}>
        <div className={styles.searchArea}>
          <SearchProofDialog
            isActivated={isActivated}
            proofInstanceId={proofInstanceId}
            proofType={proofType}
            handleSelectProofType={handleSelectProofType}
            webappConsoleEndpoint={process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}
          />
        </div>
      </div>
      <MastheadRightGroup className={styles.rightGroup}>
        <Tooltip label={i18n.docs}>
          <MastheadRightGroupMenu className={cn(styles.menu, styles.bigScreen)}>
            <Link href={process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}>
              <BsBook />
            </Link>
          </MastheadRightGroupMenu>
        </Tooltip>
        <MastheadRightGroupMenu className={cn(styles.menu, styles.appPopover)}>
          <PrfsAppsPopoverDefault />
        </MastheadRightGroupMenu>
        <MastheadRightGroupMenu className={cn(styles.menu, styles.signInBtn)}>
          <PrfsIdSignInBtn />
        </MastheadRightGroupMenu>
      </MastheadRightGroup>
    </MastheadWrapper>
  );
};

export default ProofTypeMasthead;

export interface ProofTypeMastheadProps {
  isActivated?: boolean;
  proofInstanceId: string | undefined;
  proofType: PrfsProofType | undefined;
  handleSelectProofType: (proofType: PrfsProofType) => void;
}
