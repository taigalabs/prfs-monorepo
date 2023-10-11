"use client";

import React from "react";
import Logo from "@taigalabs/prfs-react-components/src/logo/Logo";
import Link from "next/link";
import ActiveLink from "@taigalabs/prfs-react-components/src/active_link/ActiveLink";
import PrfsAppsPopover from "@taigalabs/prfs-react-components/src/prfs_apps_popover/PrfsAppsPopover";

import styles from "./DocMasthead.module.scss";
import { i18nContext } from "@/contexts/i18n";
import { paths } from "@/paths";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";

const DocMasthead: React.FC<DocMastheadProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.leftGroup}>
          <Link href={paths.__}>
            <div className={styles.logo}>
              <ImageLogo width={45} />
              <span className={styles.appName}>{i18n.proof}</span>
              <span className={styles.betaTag}>{i18n.beta}</span>
            </div>
          </Link>
        </div>
        <ul className={styles.rightGroup}>
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

export default DocMasthead;

export interface DocMastheadProps {}
