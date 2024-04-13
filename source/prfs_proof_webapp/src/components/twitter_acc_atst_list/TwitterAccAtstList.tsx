"use client";

import React from "react";
import cn from "classnames";

import styles from "./TwitterAccAtstList.module.scss";
import { i18nContext } from "@/i18n/context";
import TwitterAccAtstTable from "./TwitterAccAtstTable";
import { AppHeader, AppTitle } from "@/components/app_components/AppComponents";

const TwitterAccAtstList: React.FC<TwitterAccAtstListProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <>
      <AppHeader>
        <AppTitle className={styles.title}>{i18n.twitter_acc_attestations}</AppTitle>
      </AppHeader>
      <div>
        <TwitterAccAtstTable />
      </div>
    </>
  );
};

export default TwitterAccAtstList;

export interface TwitterAccAtstListProps {}
