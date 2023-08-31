"use client";

import React from "react";
import { useRouter } from "next/navigation";

import styles from "./HomePage.module.scss";
import { paths } from "@/paths";
import { stateContext } from "@/contexts/state";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import { envs } from "@/envs";

const HomePage: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  return (
    <DefaultLayout>
      <div className={styles.container}>
        <div className={styles.leftColumn}></div>
        <div className={styles.rightColumn}>power</div>
      </div>
    </DefaultLayout>
  );
};

export default HomePage;
