"use client";

import React from "react";
import cn from "classnames";

import styles from "./TwitterAccVerification.module.scss";
import { i18nContext } from "@/i18n/context";
import Link from "next/link";
import { paths } from "@/paths";
import ProofTypeMasthead from "@/components/proof_type_masthead/ProofTypeMasthead";
import AccVerificationMasthead from "../acc_verification_masthead/AccVerificationMasthead";

const TwitterAccVerification: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <>
      <AccVerificationMasthead />
      <div className={styles.wrapper}>
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
