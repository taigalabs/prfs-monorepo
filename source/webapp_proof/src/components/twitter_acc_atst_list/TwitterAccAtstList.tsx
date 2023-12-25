"use client";

import React from "react";
import cn from "classnames";

import styles from "./TwitterAccAtstList.module.scss";
import { i18nContext } from "@/i18n/context";
import { AttestationsTitle } from "@/components/attestations/Attestations";
import { useRandomKeyPair } from "@/hooks/key";
import { envs } from "@/envs";
import { paths } from "@/paths";
import TwitterAccAtstTable from "./TwitterAccAtstTable";

const TwitterAccAtstList: React.FC<TwitterAccAtstListProps> = () => {
  const i18n = React.useContext(i18nContext);

  return (
    <>
      <AttestationsTitle className={styles.title}>
        {i18n.twitter_acc_attestations}
      </AttestationsTitle>
      <div>
        <TwitterAccAtstTable />
      </div>
    </>
  );
};

export default TwitterAccAtstList;

export interface TwitterAccAtstListProps {}
