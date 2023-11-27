"use client";

import React from "react";
import cn from "classnames";

import styles from "./AuthList.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Link from "next/link";
import { paths } from "@/paths";

const AuthList: React.FC = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          <Link href={paths.auth_twitter}>
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
  );
};

export default AuthList;
