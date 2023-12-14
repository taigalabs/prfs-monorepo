"use client";

import React from "react";
import cn from "classnames";
import Link from "next/link";
import PrfsAppsPopover from "@taigalabs/prfs-react-components/src/prfs_apps_popover/PrfsAppsPopover";
import { BsBook } from "@react-icons/all-files/bs/BsBook";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import SearchProofDialog from "@taigalabs/prfs-react-components/src/search_proof_dialog/SearchProofDialog";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";
import Tooltip from "@taigalabs/prfs-react-components/src/tooltip/Tooltip";

import styles from "./ProofTypeMasthead.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import { useIsTutorial } from "@/hooks/tutorial";
import PrfsIdSignInBtn from "../prfs_id_sign_in_btn/PrfsIdSignInBtn";

const ProofTypeMasthead: React.FC<ProofTypeMastheadProps> = ({
  isActivated,
  proofInstanceId,
  proofType,
  handleSelectProofType,
}) => {
  const i18n = React.useContext(i18nContext);
  const isTutorial = useIsTutorial();

  return (
    <div className={cn({ [styles.wrapper]: true, [styles.isTutorial]: isTutorial })}>
      <div className={styles.inner}>
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
          <ul className={styles.rightArea}>
            <Tooltip label={i18n.docs}>
              <li className={cn(styles.menu, styles.bigScreen)}>
                <Link href={process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}>
                  <BsBook />
                </Link>
              </li>
            </Tooltip>
            <li className={cn(styles.menu, styles.appPopover)}>
              <PrfsAppsPopover
                className={styles.popover}
                isOpenClassName={styles.popoverIsOpen}
                webappPollEndpoint={process.env.NEXT_PUBLIC_WEBAPP_POLL_ENDPOINT}
                webappProofEndpoint={process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}
                webappConsoleEndpoint={process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}
                tooltip={i18n.apps}
              />
            </li>
            <li className={(styles.menu, styles.signInBtn)}>
              <PrfsIdSignInBtn />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProofTypeMasthead;

export interface ProofTypeMastheadProps {
  isActivated?: boolean;
  proofInstanceId: string | undefined;
  proofType: PrfsProofType | undefined;
  handleSelectProofType: (proofType: PrfsProofType) => void;
}
