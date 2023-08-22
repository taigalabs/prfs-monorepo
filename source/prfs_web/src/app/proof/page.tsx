"use client";

import React from "react";
import NoSSR from "@taigalabs/prfs-react-components/src/no_ssr/NoSSR";

import styles from "./ProofAppPage.module.scss";
import { stateContext } from "@/contexts/state";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import ExploreTechSection from "@/components/explore_tech_section/ExploreTechSection";
import LatestPrfsUpdateSection from "@/components/latest_prfs_update_section/LatestPrfsUpdateSection";
import ProjectMeta from "@/components/project_meta/ProjectMeta";

const Home: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const { dispatch } = React.useContext(stateContext);

  useLocalWallet(dispatch);

  return (
    <NoSSR>
      <DefaultLayout>
        <div className={styles.container}>
          <div className={styles.leftColumn}></div>
          <div className={styles.rightColumn}>
            <div className={styles.sectionWrapper}>
              <ExploreTechSection />
            </div>
            <div className={styles.sectionWrapper}>
              <LatestPrfsUpdateSection />
            </div>
            <div className={styles.sectionWrapper}>
              <ProjectMeta />
            </div>
          </div>
        </div>
      </DefaultLayout>
    </NoSSR>
  );
};

export default Home;
