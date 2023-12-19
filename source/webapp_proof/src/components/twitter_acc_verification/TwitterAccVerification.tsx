"use client";

import React from "react";
import cn from "classnames";

import styles from "./TwitterAccVerification.module.scss";
import { i18nContext } from "@/i18n/context";
import Link from "next/link";
import { paths } from "@/paths";
import AccVerificationMasthead from "@/components/acc_verification_masthead/AccVerificationMasthead";
import { MastheadPlaceholder } from "@/components/masthead/Masthead";
import LeftBar from "./LeftBar";

const TwitterAccVerification: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  const handleClickShowLeftBar = React.useCallback(() => {}, []);

  return (
    <>
      <AccVerificationMasthead handleClickShowLeftBar={handleClickShowLeftBar} />
      <MastheadPlaceholder tallHeight />
      <div className={styles.wrapper}>
        <LeftBar />
        <ul className={styles.list}>
          <li className={styles.listItem}>
            <Link href={paths.account_verification__twitter}>
              <img
                src="https://d1w1533jipmvi2.cloudfront.net/x-logo-black.png"
                alt="Twitter"
                crossOrigin=""
              />
              <p>{i18n.authorize_twitter_account}</p>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default TwitterAccVerification;
