"use client";

import React from "react";
import Link from "next/link";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";

import styles from "./DocMasthead.module.scss";
import { i18nContext } from "@/i18n/context";
import PrfsAppsPopoverDefault from "@/components/prfs_apps_popover_default/PrfsAppsPopoverDefault";

const DocMasthead: React.FC<DocMastheadProps> = ({ title, titleHref }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <div className={styles.leftGroup}>
          <Link href={titleHref || ""}>
            <div className={styles.logo}>
              <ImageLogo width={45} />
              {title && <span className={styles.title}>{title}</span>}
              {/* <span className={styles.betaTag}>{i18n.beta}</span> */}
            </div>
          </Link>
        </div>
        <ul className={styles.rightGroup}>
          <li>
            <PrfsAppsPopoverDefault />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DocMasthead;

export interface DocMastheadProps {
  title?: string;
  titleHref?: string;
}
