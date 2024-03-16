"use client";

import React from "react";
import { useRouter } from "next/navigation";

import styles from "./Account.module.scss";

const Account: React.FC<AccountProps> = () => {
  const router = useRouter();
  const [isLeftBarDrawerVisible, setIsLeftBarDrawerVisible] = React.useState(false);
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

  return <div className={styles.wrapper}>account</div>;
};

export default Account;

export interface AccountProps {}
