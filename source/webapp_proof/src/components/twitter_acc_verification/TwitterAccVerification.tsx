"use client";

import React from "react";
import cn from "classnames";
import Link from "next/link";

import styles from "./TwitterAccVerification.module.scss";
import { i18nContext } from "@/i18n/context";
import { paths } from "@/paths";
import AccVerificationMasthead from "@/components/acc_verification_masthead/AccVerificationMasthead";
import { MastheadPlaceholder } from "@/components/masthead/Masthead";
import LeftBar from "./LeftBar";
import AccVerifyLogoArea from "../acc_verification_masthead/LogoArea";

const TwitterAccVerification: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const [isLeftBarVisible, setIsLeftBarVisible] = React.useState(true);

  const handleClickShowLeftBar = React.useCallback(() => {
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
        <div
          className={cn(styles.leftBarDrawerContainer, { [styles.isVisible]: !isLeftBarVisible })}
        >
          <AccVerifyLogoArea handleClickShowLeftBar={handleClickShowLeftBar} />
          <LeftBar />
        </div>
        <div className={styles.main}>main</div>
        {/* <ul className={styles.list}> */}
        {/*   <li className={styles.listItem}> */}
        {/*     <Link href={paths.account_verification__twitter}> */}
        {/*       <img */}
        {/*         src="https://d1w1533jipmvi2.cloudfront.net/x-logo-black.png" */}
        {/*         alt="Twitter" */}
        {/*         crossOrigin="" */}
        {/*       /> */}
        {/*       <p>{i18n.authorize_twitter_account}</p> */}
        {/*     </Link> */}
        {/*   </li> */}
        {/* </ul> */}
      </div>
    </>
  );
};

export default TwitterAccVerification;
