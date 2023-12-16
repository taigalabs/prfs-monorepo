"use client";

import React from "react";
import Link from "next/link";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";

import styles from "./DocMasthead.module.scss";
import { i18nContext } from "@/i18n/context";
import PrfsAppsPopoverDefault from "@/components/prfs_apps_popover_default/PrfsAppsPopoverDefault";
import {
  MastheadLogoArea,
  MastheadMain,
  MastheadRightGroup,
  MastheadWrapper,
} from "../masthead/Masthead";
import { paths } from "@/paths";

const DocMasthead: React.FC<DocMastheadProps> = ({ title, titleHref }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <MastheadWrapper>
      <MastheadLogoArea>
        <a href={paths.__}>
          <ImageLogo width={50} />
          {title && <span className={styles.title}>{title}</span>}
        </a>
      </MastheadLogoArea>
      {/* <div className={styles.leftGroup}> */}
      {/*   <Link href={titleHref || ""}> */}
      {/*     <div className={styles.logo}> */}
      {/*       <ImageLogo width={45} /> */}
      {/*       {title && <span className={styles.title}>{title}</span>} */}
      {/*       {/* <span className={styles.betaTag}>{i18n.beta}</span> */}
      {/*     </div> */}
      {/*   </Link> */}
      {/* </div> */}
      <MastheadMain>
        <MastheadRightGroup>
          <li>
            <PrfsAppsPopoverDefault />
          </li>
        </MastheadRightGroup>
        {/* <ul className={styles.rightGroup}> */}
        {/* </ul> */}
      </MastheadMain>
    </MastheadWrapper>
  );
};

export default DocMasthead;

export interface DocMastheadProps {
  title?: string;
  titleHref?: string;
}
