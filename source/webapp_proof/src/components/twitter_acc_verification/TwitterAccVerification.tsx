"use client";

import React from "react";
import cn from "classnames";
import Link from "next/link";

import styles from "./TwitterAccVerification.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import AccVerificationMasthead from "@/components/acc_verification_masthead/AccVerificationMasthead";
import { MastheadPlaceholder } from "@/components/masthead/Masthead";
import AccVerifyLogoArea from "@/components/acc_verification_masthead/AccVerifyLogoArea";
import LeftBar from "./LeftBar";
import LeftBarDrawer from "./LeftBarDrawer";
// import layouts from "@/styles/layouts.module.scss";

// const bigDisplayWidth = layouts.view_port_min_width_big_display.substring(
//   0,
//   layouts.view_port_min_width_big_display.length - 2,
// );

// console.log(11, Number(bigDisplayWidth));

const TwitterAccVerification: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const [isLeftBarVisible, setIsLeftBarVisible] = React.useState(true);
  const [isLeftBarDrawerVisible, setIsLeftBarDrawerVisible] = React.useState(false);

  const handleClickShowLeftBar = React.useCallback(() => {
    setIsLeftBarVisible(v => !v);
  }, [setIsLeftBarVisible]);

  const handleClickShowLeftBarDrawer = React.useCallback(() => {
    console.log(11);
    setIsLeftBarDrawerVisible(v => !v);
  }, [setIsLeftBarDrawerVisible]);

  return (
    <>
      <AccVerificationMasthead
        handleClickShowLeftBar={handleClickShowLeftBar}
        handleClickShowLeftBarDrawer={handleClickShowLeftBarDrawer}
      />
      <MastheadPlaceholder tallHeight />
      <div className={styles.wrapper}>
        <div className={cn(styles.leftBarContainer, { [styles.isVisible]: isLeftBarVisible })}>
          <LeftBar />
        </div>
        <LeftBarDrawer isOpen={isLeftBarDrawerVisible} setIsOpen={handleClickShowLeftBarDrawer}>
          <AccVerifyLogoArea handleClickShowLeftBar={handleClickShowLeftBar} />
          <LeftBar />
        </LeftBarDrawer>
        <div className={styles.main}>main</div>
      </div>
    </>
  );
};

export default TwitterAccVerification;
