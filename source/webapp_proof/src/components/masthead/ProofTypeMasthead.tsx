"use client";

import React from "react";
import cn from "classnames";
import Link from "next/link";
import ActiveLink from "@taigalabs/prfs-react-components/src/active_link/ActiveLink";
import PrfsAppsPopover from "@taigalabs/prfs-react-components/src/prfs_apps_popover/PrfsAppsPopover";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";

import styles from "./ProofTypeMasthead.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import { useSearchParams } from "next/navigation";
import LogoContainer from "@/components/logo_container/LogoContainer";

const ProofTypeMasthead: React.FC<MastheadProps> = () => {
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
        <div>
          <a href={paths.__}>
            <LogoContainer proofTypeChosen={true} />
          </a>
        </div>
        <div>
          {/* <SelectProofTypeDialog */}
          {/*   proofType={proofType} */}
          {/*   handleSelectProofType={handleSelectProofType} */}
          {/*   webappConsoleEndpoint={process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT} */}
          {/* /> */}
        </div>
        <ul className={styles.rightGroup}>
          <li className={styles.menu}>
            <a href={tutorialUrl}>
              <p className={cn({ [styles.tutorialBtn]: true, [styles.isTutorial]: isTutorial })}>
                <span>{i18n.tutorial}</span>
                <AiOutlineClose />
              </p>
            </a>
          </li>
          <li className={cn(styles.bigScreen)}>
            <Link href={process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}>{i18n.docs}</Link>
          </li>
          <li>
            <PrfsAppsPopover
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

export interface MastheadProps {}
