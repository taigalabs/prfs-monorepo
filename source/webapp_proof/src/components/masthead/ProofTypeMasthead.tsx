"use client";

import React from "react";
import cn from "classnames";
import Link from "next/link";
import PrfsAppsPopover from "@taigalabs/prfs-react-components/src/prfs_apps_popover/PrfsAppsPopover";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import { BsBook } from "@react-icons/all-files/bs/BsBook";
import { PrfsProofType } from "@taigalabs/prfs-entities/bindings/PrfsProofType";
import SelectProofTypeDialog from "@taigalabs/prfs-react-components/src/select_proof_type_dialog/SelectProofTypeDialog";
import { useSearchParams } from "next/navigation";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";
import Tooltip from "@taigalabs/prfs-react-components/src/tooltip/Tooltip";
import { IoMdSchool } from "@react-icons/all-files/io/IoMdSchool";

import styles from "./ProofTypeMasthead.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import LogoContainer from "@/components/logo_container/LogoContainer";

const ProofTypeMasthead: React.FC<ProofTypeMastheadProps> = ({
  proofType,
  handleSelectProofType,
}) => {
  const i18n = React.useContext(i18nContext);
  const searchParams = useSearchParams();

  const { isTutorial, tutorialUrl } = React.useMemo(() => {
    if (searchParams.get("tutorial_id")) {
      return { isTutorial: true, tutorialUrl: paths.__ };
    }
    return { isTutorial: false, tutorialUrl: `${paths.__}?tutorial_id=simple_hash` };
  }, [searchParams]);

  return (
    <div className={cn({ [styles.wrapper]: true, [styles.isTutorial]: isTutorial })}>
      <div className={styles.inner}>
        <div className={styles.logoArea}>
          <a href={paths.__}>
            <ImageLogo width={55} />
          </a>
        </div>
        <div className={styles.searchArea}>
          <SelectProofTypeDialog
            proofType={proofType}
            handleSelectProofType={handleSelectProofType}
            webappConsoleEndpoint={process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}
          />
        </div>
        <ul className={styles.rightArea}>
          {isTutorial ? (
            <li className={styles.tutorialMenu}>
              <a href={tutorialUrl}>
                <div className={cn(styles.tutorialBtn)}>
                  <IoMdSchool />
                  <span>{i18n.tutorial}</span>
                  <AiOutlineClose />
                </div>
              </a>
            </li>
          ) : (
            <Tooltip label={i18n.tutorial}>
              <li className={styles.menu}>
                <a href={tutorialUrl}>
                  <IoMdSchool />
                </a>
              </li>
            </Tooltip>
          )}
          <Tooltip label={i18n.docs}>
            <li className={cn(styles.menu, styles.bigScreen)}>
              <Link href={process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}>
                <BsBook />
              </Link>
            </li>
          </Tooltip>
          <li className={styles.appPopover}>
            <PrfsAppsPopover
              className={styles.popover}
              isOpenClassName={styles.popoverIsOpen}
              webappPollEndpoint={process.env.NEXT_PUBLIC_WEBAPP_POLL_ENDPOINT}
              webappProofEndpoint={process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}
              webappConsoleEndpoint={process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}
            />
          </li>
          {/* <li>{i18n.account}</li> */}
        </ul>
      </div>
    </div>
  );
};

export default ProofTypeMasthead;

export interface ProofTypeMastheadProps {
  proofType: PrfsProofType | undefined;
  handleSelectProofType: (proofType: PrfsProofType) => void;
}
