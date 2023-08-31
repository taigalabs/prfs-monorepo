"use client";

import React from "react";
import { useRouter } from "next/navigation";

import styles from "./HomePage.module.scss";
import Teaser from "@/components/teaser/Teaser";
import { paths } from "@/paths";
import { stateContext } from "@/contexts/state";
import { i18nContext } from "@/contexts/i18n";
import DefaultLayout from "@/layouts/default_layout/DefaultLayout";
import useLocalWallet from "@/hooks/useLocalWallet";
import ExploreTechSection from "@/components/explore_tech_section/ExploreTechSection";
import LatestPrfsUpdateSection from "@/components/latest_prfs_update_section/LatestPrfsUpdateSection";
import ProjectMeta from "@/components/project_meta/ProjectMeta";

const HomePage: React.FC = () => {
  const i18n = React.useContext(i18nContext);
  const router = useRouter();

  return process.env.NEXT_PUBLIC_IS_TEASER === "yes" ? <Teaser /> : (
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

  );
};

export default HomePage;
