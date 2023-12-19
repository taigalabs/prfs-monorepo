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

const TwitterAccVerification: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const [isLeftBarVisible, setIsLeftBarVisible] = React.useState(true);

  const handleClickShowLeftBar = React.useCallback(() => {
    console.log(22);
    setIsLeftBarVisible(v => !v);
  }, [setIsLeftBarVisible]);

  console.log(55, isLeftBarVisible);

  return (
    <>
      <AccVerificationMasthead handleClickShowLeftBar={handleClickShowLeftBar} />
      <MastheadPlaceholder tallHeight />
      <div className={styles.wrapper}>
        <div className={cn(styles.leftBarContainer, { [styles.isVisible]: isLeftBarVisible })}>
          <LeftBar />
        </div>
        {/* <div */}
        {/*   className={cn(styles.leftBarDrawerContainer, { [styles.isVisible]: !isLeftBarVisible })} */}
        {/* > */}
        <LeftBarDrawer isOpen={!isLeftBarVisible} setIsOpen={handleClickShowLeftBar}>
          <AccVerifyLogoArea handleClickShowLeftBar={handleClickShowLeftBar} />
          <LeftBar />
        </LeftBarDrawer>
        {/* <LeftBar /> */}
        {/* </div> */}
        <div className={styles.main}>main</div>
      </div>
    </>
  );
};

export default TwitterAccVerification;
