"use client";

import React from "react";
import cn from "classnames";
import Link from "next/link";
import PrfsAppsPopover from "@taigalabs/prfs-react-components/src/prfs_apps_popover/PrfsAppsPopover";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import { BsThreeDots } from "@react-icons/all-files/bs/BsThreeDots";

import styles from "./Masthead.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import { useSearchParams } from "next/navigation";

const Masthead: React.FC<MastheadProps> = () => {
  const i18n = React.useContext(i18nContext);

  const searchParams = useSearchParams();
  const [isTutorial, tutorialUrl] = React.useMemo(() => {
    if (searchParams.get("tutorial_id")) {
      return [true, paths.__];
    }
    return [false, `${paths.__}?tutorial_id=simple_hash`];
  }, [searchParams]);

  return (
    <div className={cn({ [styles.wrapper]: true, [styles.isTutorial]: isTutorial })}>
      <div className={styles.inner}>
        <ul className={styles.rightGroup}>
          <li className={styles.menu}>
            <a href={tutorialUrl}>
              <p className={cn({ [styles.tutorialBtn]: true, [styles.isTutorial]: isTutorial })}>
                <span>{i18n.tutorial}</span>
                <AiOutlineClose />
              </p>
            </a>
          </li>
          <li className={cn(styles.menu)}>
            <Link href={paths.auth}>{i18n.auth}</Link>
          </li>
          <li className={cn(styles.bigScreen, styles.menu)}>
            <Link href={process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}>{i18n.docs}</Link>
          </li>
          <li className={styles.menu}>
            <PrfsAppsPopover
              webappPollEndpoint={process.env.NEXT_PUBLIC_WEBAPP_POLL_ENDPOINT}
              webappProofEndpoint={process.env.NEXT_PUBLIC_WEBAPP_PROOF_ENDPOINT}
              webappConsoleEndpoint={process.env.NEXT_PUBLIC_WEBAPP_CONSOLE_ENDPOINT}
            />
          </li>
          <li className={styles.menu}>
            <Link href={paths.id}>{i18n.log_in}</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Masthead;

export interface MastheadProps {}
