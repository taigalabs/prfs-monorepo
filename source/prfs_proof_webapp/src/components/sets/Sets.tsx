"use client";

import React from "react";
import cn from "classnames";

import styles from "./Sets.module.scss";
import { i18nContext } from "@/i18n/context";
import { MastheadPlaceholder } from "@/components/masthead/MastheadComponents";
import SetLeftBar from "./SetLeftBar";
import LeftBarDrawer from "@/components/left_bar/LeftBarDrawer";
import AppLogo from "@/components/app_logo/AppLogo";
import { urls } from "@/urls";
import { paths } from "@/paths";
import AppMasthead from "@/components/app_masthead/AppMasthead";

const Sets: React.FC<SetsProps> = ({ children }) => {
  const i18n = React.useContext(i18nContext);
  const [isLeftBarVisible, setIsLeftBarVisible] = React.useState(true);
  const [isLeftBarDrawerVisible, setIsLeftBarDrawerVisible] = React.useState(false);

  const handleClickShowLeftBar = React.useCallback(
    (open?: boolean) => {
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
      <AppMasthead
        appLabel={i18n.sets}
        appUrl={paths.sets}
        handleClickShowLeftBar={handleClickShowLeftBar}
        handleClickShowLeftBarDrawer={handleClickShowLeftBarDrawer}
      />
      <MastheadPlaceholder tallHeight />
      <div className={styles.wrapper}>
        <div className={cn(styles.leftBarContainer, { [styles.isVisible]: isLeftBarVisible })}>
          <SetLeftBar />
        </div>
        <LeftBarDrawer isOpen={isLeftBarDrawerVisible} setIsOpen={handleClickShowLeftBarDrawer}>
          <div className={styles.drawerLogoArea}>
            <AppLogo
              handleClickShowLeftBar={handleClickShowLeftBar}
              url={urls.sets}
              label={i18n.sets}
            />
          </div>
          <SetLeftBar />
        </LeftBarDrawer>
        {children}
      </div>
    </>
  );
};

export default Sets;

export interface SetsProps {
  children: React.ReactNode;
  className?: string;
}
