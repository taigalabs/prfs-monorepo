"use client";

import React from "react";
import cn from "classnames";

import styles from "./ProofTypes.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import { MastheadPlaceholder } from "@/components/masthead/MastheadComponents";
import ProofTypeLeftBar from "./ProofTypeLeftBar";
import LeftBarDrawer from "@/components/left_bar/LeftBarDrawer";
import { LeftBarContainer } from "@/components/left_bar/LeftBar";
import AppLogo from "@/components/app_logo/AppLogo";
import AppMasthead from "@/components/app_masthead/AppMasthead";

const ProofTypes: React.FC<ProofTypesProps> = ({ children }) => {
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
        appLabel={i18n.proof_types}
        appUrl={paths.proof_types}
        handleClickShowLeftBar={handleClickShowLeftBar}
        handleClickShowLeftBarDrawer={handleClickShowLeftBarDrawer}
      />
      <MastheadPlaceholder tallHeight />
      <div className={styles.wrapper}>
        <LeftBarContainer isVisible={isLeftBarVisible}>
          <ProofTypeLeftBar />
        </LeftBarContainer>
        <LeftBarDrawer isOpen={isLeftBarDrawerVisible} setIsOpen={handleClickShowLeftBarDrawer}>
          <div className={styles.drawerLogoArea}>
            <AppLogo
              handleClickShowLeftBar={handleClickShowLeftBar}
              url={paths.attestations}
              label={i18n.attestations}
            />
          </div>
          <ProofTypeLeftBar />
        </LeftBarDrawer>
        {children}
      </div>
    </>
  );
};

export default ProofTypes;

export interface ProofTypesProps {
  children: React.ReactNode;
  className?: string;
}
