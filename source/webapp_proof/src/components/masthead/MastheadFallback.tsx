import React from "react";
import cn from "classnames";
import Link from "next/link";
import PrfsAppsPopover from "@taigalabs/prfs-react-components/src/prfs_apps_popover/PrfsAppsPopover";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";

import styles from "./Masthead.module.scss";
import { getI18N } from "@/i18n/getI18N";

const MastheadFallback: React.FC<MastheadProps> = async () => {
  const i18n = await getI18N();

  return (
    <div className={cn(styles.wrapper)}>
      <div className={styles.inner}>
        <ul className={styles.rightGroup}>
          <li className={styles.menu}>
            <span>{i18n.tutorial}</span>
            <AiOutlineClose />
          </li>
          <li className={cn(styles.bigScreen)}>
            <Link href={process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}>{i18n.docs}</Link>
          </li>
          <li className={styles.menu}>
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

export default MastheadFallback;

export interface MastheadProps {}
