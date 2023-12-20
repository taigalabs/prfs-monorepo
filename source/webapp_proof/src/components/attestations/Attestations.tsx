"use client";

import React from "react";
import cn from "classnames";
import Link from "next/link";

import styles from "./Attestations.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import AttestationsMasthead from "@/components/attestations_masthead/AttestationsMasthead";
import { MastheadPlaceholder } from "@/components/masthead/Masthead";
import AttestationsLogoArea from "@/components/attestations_masthead/AttestationsLogoArea";
import LeftBar from "./LeftBar";
import LeftBarDrawer from "./LeftBarDrawer";

const Attestations: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const [isLeftBarVisible, setIsLeftBarVisible] = React.useState(true);
  const [isLeftBarDrawerVisible, setIsLeftBarDrawerVisible] = React.useState(false);

  const handleClickShowLeftBar = React.useCallback(
    (open?: boolean) => {
      console.log(111, open);
      if (open !== undefined) {
        setIsLeftBarVisible(open);
      } else {
        setIsLeftBarVisible(v => !v);
      }
    },
    [setIsLeftBarVisible],
  );

  const handleClickShowLeftBarDrawer = React.useCallback(
    (open?: boolean) => {
      if (open !== undefined) {
        setIsLeftBarDrawerVisible(open);
      } else {
        setIsLeftBarDrawerVisible(v => !v);
      }
    },
    [setIsLeftBarDrawerVisible],
  );

  return (
    <>
      <AttestationsMasthead
        handleClickShowLeftBar={handleClickShowLeftBar}
        handleClickShowLeftBarDrawer={handleClickShowLeftBarDrawer}
      />
      <MastheadPlaceholder tallHeight />
      <div className={styles.wrapper}>
        <div className={cn(styles.leftBarContainer, { [styles.isVisible]: isLeftBarVisible })}>
          <LeftBar />
        </div>
        <LeftBarDrawer isOpen={isLeftBarDrawerVisible} setIsOpen={handleClickShowLeftBarDrawer}>
          <AttestationsLogoArea handleClickShowLeftBar={handleClickShowLeftBar} />
          <LeftBar />
        </LeftBarDrawer>
        <div className={styles.main}>main</div>
      </div>
    </>
  );
};

export default Attestations;
