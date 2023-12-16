"use client";

import React from "react";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";

import styles from "./DocMasthead.module.scss";
import { i18nContext } from "@/i18n/context";
import PrfsAppsPopoverDefault from "@/components/prfs_apps_popover_default/PrfsAppsPopoverDefault";
import {
  MastheadLogoArea,
  MastheadMain,
  MastheadRightGroup,
  MastheadRightGroupMenu,
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
      <MastheadMain>
        <MastheadRightGroup>
          <MastheadRightGroupMenu>
            <PrfsAppsPopoverDefault />
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
