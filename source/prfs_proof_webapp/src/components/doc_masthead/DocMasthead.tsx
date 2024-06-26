"use client";

import React from "react";
import ImageLogo from "@taigalabs/prfs-react-lib/src/image_logo/ImageLogo";

import styles from "./DocMasthead.module.scss";
import { i18nContext } from "@/i18n/context";
import PrfsAppsPopoverDefault from "@/components/prfs_apps_popover_default/PrfsAppsPopoverDefault";
import {
  MastheadLogoArea,
  MastheadMain,
  MastheadRightGroup,
  MastheadRightGroupMenu,
  MastheadWrapper,
} from "@/components/masthead/MastheadComponents";
import { paths } from "@/paths";

const DocMasthead: React.FC<DocMastheadProps> = ({ title, titleHref }) => {
  const i18n = React.useContext(i18nContext);

  return (
    <MastheadWrapper className={styles.wrapper}>
      <MastheadLogoArea className={styles.logoArea}>
        <a href={paths.__}>
          <ImageLogo width={50} />
          {title && <span className={styles.title}>{title}</span>}
        </a>
      </MastheadLogoArea>
      <MastheadMain>
        <MastheadRightGroup staticPosition>
          <MastheadRightGroupMenu>
            <PrfsAppsPopoverDefault disableMarkIsOpen />
          </MastheadRightGroupMenu>
        </MastheadRightGroup>
      </MastheadMain>
    </MastheadWrapper>
  );
};

export default DocMasthead;

export interface DocMastheadProps {
  title?: string;
  titleHref?: string;
}
