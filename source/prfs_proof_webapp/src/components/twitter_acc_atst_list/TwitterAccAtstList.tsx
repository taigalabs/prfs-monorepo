"use client";

import React from "react";
import cn from "classnames";

import styles from "./TwitterAccAtstList.module.scss";
import { i18nContext } from "@/i18n/context";
import TwitterAccAtstTable from "./TwitterAccAtstTable";
import { AttestationsHeader, AttestationsTitle } from "../attestations/AttestationComponents";

const TwitterAccAtstList: React.FC<TwitterAccAtstListProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <>
      <AttestationsHeader>
        <AttestationsTitle className={styles.title}>
          {i18n.twitter_acc_attestations}
        </AttestationsTitle>
      </AttestationsHeader>
      <div>
        <TwitterAccAtstTable />
      </div>
    </>
  );
};

export default TwitterAccAtstList;

export interface TwitterAccAtstListProps {}
